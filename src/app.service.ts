import { Inject, Injectable } from '@nestjs/common';
import { ServerConfiguration } from './config/config';
import { Request, Response } from 'express';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

type CacheObj = {
  status: number;
  headers: Headers;
  arrayBuffer: ArrayBuffer;
}

@Injectable()
export class AppService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheService : Cache,
    private config : ServerConfiguration
  ) {}
  
  log(req: Request, isCacheHit = false): void {
    
    isCacheHit ? console.log("--------Cache hit--------") : console.log("--------Cache miss--------");
    console.log(`\nforwarding request to ${this.config.forwardUrl}${req.url}`);
    console.log(`using headers ${JSON.stringify(req.headers)}`);
    console.log(`using body ${JSON.stringify(req.body)}`);
  }
  
  // skipcq: JS-0323
  // req and res are express objects
  async forward(req : Request , res : Response): Promise<void> {

    // skipcq: JS-0323
    const response : CacheObj | null = await this.cacheService.get(req.url);

    if (response) {
      // skipcq: JS-0002
      this.log(req , true);

      console.log("returning response from cache\n");

      res.status(response.status);

      AppService.setHeaders(req , res , response , "HIT");

      res.write(Buffer.from(response.arrayBuffer));

      res.end();

      return
    }

    this.log(req);

    const fetchConfig : RequestInit = {
      headers: Object.create(req.headers),
      method: req.method,
    }

    if (Object.keys(req.body).length > 0 && (req.method !== "GET" && req.method !== "HEAD")) {
      fetchConfig.body = JSON.stringify(req.body);
    }

    const responseFromServer = await fetch(`${this.config.forwardUrl}${req.url}`, fetchConfig);

    // skipcq: JS-0002
    console.log(`Status code from server ${responseFromServer.status}`);

    const cacheObj : CacheObj = {
      status: responseFromServer.status,
      headers: responseFromServer.headers,
      arrayBuffer: await responseFromServer.arrayBuffer()
    }

    // key , value , ttl
    await this.cacheService.set(req.url, cacheObj, 5000);

    
    res.status(cacheObj.status);

    AppService.setHeaders(req , res , cacheObj , "MISS");

    res.write(Buffer.from(cacheObj.arrayBuffer));

    // skipcq: JS-0002
    console.log("now returning response from server\n");

    res.end();
  }

  static setHeaders(req : Request , res : Response , response : CacheObj , cacheStatus : string) {
    for (const [key, value] of Object.entries(response.headers)) {
      // skipcq: JS-0002
      console.log(`setting header ${key} with value ${value}`);
      res.setHeader(key, value);
    }

    res.setHeader("X-Cache", cacheStatus);
  }
}
