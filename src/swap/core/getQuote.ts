import { GetSwapQuote } from '../../definitions/swap';
import { sendRequest } from '../../queries/request';
import type {
  GetQuoteResponse,
  GetQuoteParams,
  GetQuoteAPIParams,
  Quote,
  SwapError,
} from '../types';
import { getParamsForToken } from './utils';

/**
 * Retrieves a quote for a swap from Token A to Token B.
 */
export async function getQuote(params: GetQuoteParams): Promise<GetQuoteResponse> {
  // Default parameters
  const defaultParams = {
    amountReference: 'from',
  };

  params = { ...defaultParams, ...params };

  const apiParams = getParamsForToken(params);

  try {
    const res = await sendRequest<GetQuoteAPIParams, Quote>(GetSwapQuote, [apiParams]);

    if (res.error) {
      return {
        code: res.error.code,
        error: res.error.message,
      } as SwapError;
    }

    return res.result;
  } catch (error) {
    throw new Error(`getQuote: ${error}`);
  }
}
