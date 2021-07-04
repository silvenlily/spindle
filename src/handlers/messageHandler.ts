import type eris from "eris";
import type pg from "pg";

async function messageHandler(
  msg: eris.Message<eris.PossiblyUncachedTextableChannel>,
  bot: eris.Client,
  pg?: pg.Client
) {}

export { messageHandler };
export default messageHandler;
