import { IsOptional, IsString, IsUrl, MaxLength, MinLength } from "class-validator";
import { IsFutureDate } from "@app/validators/is-future-date";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateUrlDto {
  @ApiPropertyOptional({
    description:
      "Custom alias for the shortened URL. If not provided, a random one will be generated.",
    minLength: 1,
    maxLength: 20,
    example: "custom-alias",
  })
  @IsOptional()
  @IsString()
  @MinLength(1, { message: "Alias must be at least 1 character long" })
  @MaxLength(20, { message: "Alias must not exceed 20 characters" })
  alias?: string;

  @ApiPropertyOptional({
    description: "Expiration date. ISO 8601 format. Must be a future date.",
    example: "2025-12-31T23:59:59.000Z",
  })
  @IsOptional()
  @IsFutureDate()
  expiresAt?: string;

  @ApiProperty({
    description: "The original URL to be shortened. Must be a valid URL",
    example: "https://example.com/very/long/url/path",
    maxLength: 2048,
  })
  @IsUrl({ max_allowed_length: 2048 }, { message: "Invalid URL format" })
  url: string;
}
