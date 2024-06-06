import { getQuote } from './getQuote';
import { sendRequest } from '../../queries/request';
import { GetSwapQuote } from '../../definitions/swap';
import { Token } from '../../token';

jest.mock('../../queries/request');

describe('getQuote', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const ETH: Token = {
    name: 'ETH',
    address: '',
    symbol: 'ETH',
    decimals: 18,
    image: 'https://wallet-api-production.s3.amazonaws.com/uploads/tokens/eth_288.png',
    chainId: 8453,
  };

  const DEGEN: Token = {
    name: 'DEGEN',
    address: '0x4ed4e862860bed51a9570b96d89af5e1b0efefed',
    symbol: 'DEGEN',
    decimals: 18,
    image:
      'https://d3r81g40ycuhqg.cloudfront.net/wallet/wais/3b/bf/3bbf118b5e6dc2f9e7fc607a6e7526647b4ba8f0bea87125f971446d57b296d2-MDNmNjY0MmEtNGFiZi00N2I0LWIwMTItMDUyMzg2ZDZhMWNm',
    chainId: 8453,
  };

  it('should return a quote for a swap', async () => {
    const mockParams = {
      amountReference: 'from',
      from: ETH,
      to: DEGEN,
      amount: '3305894409732200',
    };

    const mockResponse = {
      id: 1,
      jsonrpc: '2.0',
      result: {
        fromAsset: {
          name: 'ETH',
          address: '',
          currencyCode: 'ETH',
          decimals: 18,
          imageURL: 'https://wallet-api-production.s3.amazonaws.com/uploads/tokens/eth_288.png',
          blockchain: 'eth',
          aggregators: ['zeroex', '1inch'],
          swappable: true,
          unverified: false,
          chainId: 8453,
        },
        toAsset: {
          name: 'DEGEN',
          address: '0x4ed4e862860bed51a9570b96d89af5e1b0efefed',
          currencyCode: 'DEGEN',
          decimals: 18,
          imageURL:
            'https://d3r81g40ycuhqg.cloudfront.net/wallet/wais/3b/bf/3bbf118b5e6dc2f9e7fc607a6e7526647b4ba8f0bea87125f971446d57b296d2-MDNmNjY0MmEtNGFiZi00N2I0LWIwMTItMDUyMzg2ZDZhMWNm',
          blockchain: 'eth',
          aggregators: ['1inch', 'zeroex'],
          swappable: true,
          unverified: false,
          chainId: 8453,
        },
        fromAmount: '100000000000000000',
        toAmount: '16732157880511600003860',
        amountReference: 'from',
        priceImpact: '0.07',
        chainId: 8453,
        highPriceImpact: false,
        slippage: '3',
      },
    };

    (sendRequest as jest.Mock).mockResolvedValue(mockResponse);

    const quote = await getQuote(mockParams);

    expect(quote).toEqual(mockResponse.result);

    expect(sendRequest).toHaveBeenCalledTimes(1);
    expect(sendRequest).toHaveBeenCalledWith(GetSwapQuote, [mockParams]);
  });

  it('should throw an error if sendRequest fails', async () => {
    const mockParams = {
      amountReference: 'from',
      from: ETH,
      to: DEGEN,
      amount: '3305894409732200',
    };

    const mockError = new Error('getQuote: Error: Failed to send request');
    (sendRequest as jest.Mock).mockRejectedValue(mockError);

    await expect(getQuote(mockParams)).rejects.toThrow('getQuote: Error: Failed to send request');

    expect(sendRequest).toHaveBeenCalledTimes(1);
    expect(sendRequest).toHaveBeenCalledWith(GetSwapQuote, [mockParams]);
  });

  it('should return an error object from getQuote', async () => {
    const mockParams = {
      amountReference: 'from',
      from: ETH,
      to: DEGEN,
      amount: '3305894409732200',
    };

    const mockResponse = {
      id: 1,
      jsonrpc: '2.0',
      error: {
        code: -1,
        message: 'Invalid response',
      },
    };

    (sendRequest as jest.Mock).mockResolvedValue(mockResponse);

    const error = await getQuote(mockParams);
    expect(error).toEqual({
      code: -1,
      error: 'Invalid response',
    });

    expect(sendRequest).toHaveBeenCalledTimes(1);
    expect(sendRequest).toHaveBeenCalledWith(GetSwapQuote, [mockParams]);
  });
});
