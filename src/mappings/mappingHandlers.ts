import BigNumber from "bignumber.js";
import { Contributor } from "../types";
import { SubstrateEvent } from "@subql/types";

const moonbeamParachainId = 2004;

export async function handleContributed(event: SubstrateEvent): Promise<void> {
  // const eventId = `${event.block.block.header.number.toString()}-${event.idx}`;

  // get event data
  const [address, parachainId, contributionAmount] = event.event.data;

  // ignore if this contribution isn't for moonbeam
  if (!parachainId.eq(moonbeamParachainId)) return;

  // get the contributor
  const id = address.toString();
  const contributor = (await Contributor.get(id)) || Contributor.create({ id });

  // update their contribution total
  contributor.totalContributed = new BigNumber(
    contributor.totalContributed || "0"
  )
    .plus(new BigNumber(contributionAmount.toString()))
    .toString();

  // save
  await contributor.save();
}

export async function handleMemoUpdated(event: SubstrateEvent): Promise<void> {
  // get event data
  const [address, parachainId, rewardsAddress] = event.event.data;

  // ignore if this memo isn't for moonbeam
  if (!parachainId.eq(moonbeamParachainId)) return;

  // get the contributor
  const id = address.toString();
  const contributor = (await Contributor.get(id)) || Contributor.create({ id });

  // set their rewardsAddress to the one specified in the memo
  contributor.rewardsAddress = rewardsAddress.toHex();

  // save
  await contributor.save();
}
