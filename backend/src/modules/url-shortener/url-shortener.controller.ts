import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Res,
  Ip,
} from "@nestjs/common";
import { Response } from "express";
import { UrlShortenerService } from "@app/modules/url-shortener/url-shortener.service";
import { CreateUrlDto } from "@app/modules/url-shortener/dto/create-url.dto";
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from "@nestjs/swagger";
import { SWAGGER_BASE_URL } from "@app/constants/swagger-base-url";
import { ConfigService } from "@nestjs/config";

const swagger = {
  param: {
    alias: { name: "alias", description: "The shortened URL alias" },
  },
  response: {
    urlNotFound: {
      status: 404,
      description: "URL not found",
      example: { message: "URL not found", error: "Not Found", statusCode: 404 },
    },
  },
} as const;

@ApiTags("Url shortener controller")
@Controller("")
export class UrlShortenerController {
  constructor(
    private readonly configService: ConfigService,
    private readonly urlShortenerService: UrlShortenerService,
  ) {}

  @ApiOperation({
    summary: "Create a shortened URL",
    description:
      "Generates a shortened URL for the given original link. Optionally accepts a custom alias and an expiration date.",
  })
  @ApiBody({
    type: CreateUrlDto,
    description: "Payload to create a shortened URL",
    examples: {
      default: {
        summary: "Example without alias and expiration",
        value: {
          url: "https://example.com/long-url",
        },
      },
      withAliasAndExpiry: {
        summary: "Example with custom alias and expiration date",
        value: {
          url: "https://example.com/long-url",
          alias: "my-alias",
          expiresAt: "2025-12-31T23:59:59.000Z",
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: "The URL has been successfully shortened",
    schema: {
      type: "string",
      example: {
        shortUrl: `${SWAGGER_BASE_URL}/newAlias`,
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: "The custom alias is already taken",
    example: { message: "Alias is already taken", error: "Conflict", statusCode: 409 },
  })
  @Post("shorten")
  @HttpCode(HttpStatus.CREATED)
  async createUrl(@Body() createUrlDto: CreateUrlDto): Promise<{ shortUrl: string }> {
    const alias: string = await this.urlShortenerService.createUrl(createUrlDto);

    const baseUrl = this.configService.get<string>("APP_URL");
    const port = this.configService.get<string>("APP_PORT");

    return {
      shortUrl: `${baseUrl}:${port}/${alias}`,
    };
  }

  @ApiOperation({
    summary: "Redirect to original URL",
    description: `Resolves the provided shortened URL alias and redirects the user to the original full URL.
    Tracks the IP address of the requester to update visit statistics.`,
  })
  @ApiParam(swagger.param.alias)
  @ApiResponse({
    status: 301,
    description: "Redirects to the original URL",
  })
  @ApiResponse(swagger.response.urlNotFound)
  @ApiResponse({
    status: 409,
    description: "URL has expired",
    example: { message: "URL has expired", error: "Conflict", statusCode: 409 },
  })
  @Get(":alias")
  @HttpCode(HttpStatus.MOVED_PERMANENTLY)
  async redirectToOriginalUrl(
    @Ip() ip: string,
    @Param("alias") alias: string,
    @Res() res: Response,
  ): Promise<void> {
    const url: string = await this.urlShortenerService.getOriginalUrl(alias, ip);

    res.redirect(url);
  }

  @ApiOperation({ summary: "Get URL analytics" })
  @ApiParam(swagger.param.alias)
  @ApiResponse({
    status: 200,
    description: "Returns analytics for the shortened URL",
    schema: {
      type: "object",
      properties: {
        clickCount: { type: "number", example: 42 },
        ips: { type: "array", items: { type: "string" }, example: ["192.168.1.1", "10.0.0.1"] },
      },
    },
  })
  @ApiResponse(swagger.response.urlNotFound)
  @Get("analytics/:alias")
  async getUrlAnalytics(@Param("alias") alias: string): Promise<{
    clickCount: number;
    ips: string[];
  }> {
    return this.urlShortenerService.getUrlAnalytics(alias);
  }

  @ApiOperation({ summary: "Get URL information" })
  @ApiParam(swagger.param.alias)
  @ApiResponse({
    status: 200,
    description: "Returns information about the shortened URL",
    schema: {
      type: "object",
      properties: {
        clickCount: { type: "number", example: 42 },
        createdAt: { type: "string", format: "ISO 8601 format" },
        originalUrl: { type: "string", example: "https://example.com" },
      },
    },
  })
  @ApiResponse(swagger.response.urlNotFound)
  @Get("info/:alias")
  async getUrlInfo(@Param("alias") alias: string): Promise<{
    clickCount: number;
    createdAt: Date;
    originalUrl: string;
  }> {
    return this.urlShortenerService.getUrlInfo(alias);
  }

  @ApiOperation({ summary: "Delete a shortened URL" })
  @ApiParam(swagger.param.alias)
  @ApiResponse({
    status: 204,
    description: "URL has been successfully deleted",
  })
  @ApiResponse(swagger.response.urlNotFound)
  @Delete(":alias")
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUrl(@Param("alias") alias: string): Promise<void> {
    return this.urlShortenerService.deleteUrl(alias);
  }
}
