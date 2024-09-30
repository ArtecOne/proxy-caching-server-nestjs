import { Configuration, Value } from "@itgorillaz/configify";
import { IsNotEmpty, IsPositive } from "class-validator";

@Configuration()
export class ServerConfiguration {
    @IsNotEmpty()
    @Value("PORT" , {parse : (n) => Number.parseInt(n)})
    port: number;

    @IsNotEmpty()
    @Value("FORWARD_URL")
    forwardUrl: string;
}