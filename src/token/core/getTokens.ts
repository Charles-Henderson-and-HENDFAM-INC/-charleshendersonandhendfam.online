import { CDP_LISTSWAPASSETS } from '../../definitions/swap';
import { sendRequest } from '../../queries/request';
import type { GetTokensError, GetTokensOptions, GetTokensResponse, Token } from '../types';

/**
 * Retrieves a list of tokens on Base.
 */
export async function getTokens(options?: GetTokensOptions): Promise<GetTokensResponse> {
  // Default filter values
  const defaultFilter: GetTokensOptions = {
    limit: '50',
    page: '1',
  };

  const filters = { ...defaultFilter, ...options };

  try {
    const res = await sendRequest<GetTokensOptions, Token[]>(CDP_LISTSWAPASSETS, [filters]);

    if (res.error) {
      return {
        code: res.error.code,
        error: res.error.message,
      } as GetTokensError;
    }

    return res.result;
  } catch (error) {
    throw new Error(`getTokens: ${error}`);
  }
}
