import { CronJob } from "cron";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import { ApiError } from "../errors";
import { tokenRepository } from "../repositories";
import { IError } from "../types";

dayjs.extend(utc);

export const tokensRemove = async function () {
  try {
    // console.log("Cron has Start");
    const previousMonth = dayjs().utc().subtract(30, "d");
    await tokenRepository.deleteManyByParams({
      createdAt: { $lte: previousMonth },
    });
  } catch (error) {
    const err = error as IError;
    throw new ApiError(err.message, err.status);
  }

  // lte = less than equal
  // gte = greater than equal
  // gt = greater than
  // lt = less than
};

export const removeOldTokens = new CronJob("* * * * * *", tokensRemove);
