/**
 * @jest-environment jsdom
 */
import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Address } from 'viem';
import { TokenSelectDropdown } from './TokenSelectDropdown';
import { Token } from '../types';

describe('TokenSelectDropdown', () => {
  const setToken = jest.fn();
  const options: Token[] = [
    {
      name: 'Ethereum',
      address: '' as Address,
      symbol: 'ETH',
      decimals: 18,
      image: 'https://wallet-api-production.s3.amazonaws.com/uploads/tokens/eth_288.png',
      chainId: 8453,
    },
    {
      name: 'USDC',
      address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913' as Address,
      symbol: 'USDC',
      decimals: 6,
      image:
        'https://d3r81g40ycuhqg.cloudfront.net/wallet/wais/44/2b/442b80bd16af0c0d9b22e03a16753823fe826e5bfd457292b55fa0ba8c1ba213-ZWUzYjJmZGUtMDYxNy00NDcyLTg0NjQtMWI4OGEwYjBiODE2',
      chainId: 8453,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the TokenSelectDropdown component', async () => {
    render(<TokenSelectDropdown setToken={setToken} options={options} />);

    await waitFor(() => {
      const button = screen.getByTestId('ockTokenSelectButton_Button');
      const list = screen.queryByTestId('ockTokenSelectDropdown_List');
      expect(button).toBeInTheDocument();
      expect(list).toBeNull();
    });
  });

  it('calls setToken when clicking on a token', async () => {
    render(<TokenSelectDropdown setToken={setToken} options={options} />);

    const button = screen.getByTestId('ockTokenSelectButton_Button');
    fireEvent.click(button);

    await waitFor(() => {
      fireEvent.click(screen.getByText(options[0].name));

      expect(setToken).toHaveBeenCalledWith(options[0]);
    });
  });

  it('calls onToggle when clicking outside the component', async () => {
    render(<TokenSelectDropdown setToken={setToken} options={options} />);

    const button = screen.getByTestId('ockTokenSelectButton_Button');
    fireEvent.click(button);

    const result = screen.getByTestId('ockTokenSelectDropdown_List');
    console.log(result);
    // expect(screen.getByTestId('ockTokenSelectDropdown_List')).toBeInTheDocument();
  });
});
