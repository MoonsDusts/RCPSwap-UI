import type { MultiRoute, RouteLeg, UniV3Pool } from "../../tines";

import { HEXer } from "../HEXer";
import { LiquidityProviders } from "../liquidity-providers";
import { PoolCode } from "./PoolCode";

export class UniV3PoolCode extends PoolCode {
  constructor(
    pool: UniV3Pool,
    liquidityProvider: LiquidityProviders,
    providerName: string
  ) {
    super(
      pool,
      liquidityProvider,
      `${providerName} ${(pool?.fee || 0) * 100}%`
    );
  }

  getStartPoint(): string {
    return PoolCode.RouteProcessorAddress;
  }

  getSwapCodeForRouteProcessor(
    leg: RouteLeg,
    route: MultiRoute,
    to: string
  ): string {
    return "unsupported";
  }

  getSwapCodeForRouteProcessor2(
    leg: RouteLeg,
    _route: MultiRoute,
    to: string
  ): string {
    const code = new HEXer()
      .uint8(1) // uniV3 pool
      .address(this.pool.address)
      .bool(leg.tokenFrom.address == this.pool.token0.address)
      .address(to)
      .toString();
    return code;
  }
}
