import Moralis from 'moralis';
import React, { FC, createContext, useContext, useMemo } from 'react';
import { FetchConfig, MoralisConfig, MoralisContextValue, MoralisProviderProps } from './types';

export const MoralisContext = createContext<MoralisContextValue | null>(null);

export const _useClient = () => {
  const context = useContext(MoralisContext);
  if (!context) {
    throw new Error(`Please wrap your application with MoralisProvider`);
  }
  return context;
};

export const createMoralisConfig = (config: MoralisConfig) => config;

const MoralisProvider: FC<MoralisProviderProps> = ({ children, config }) => {
  const {
    revalidateOnMount,
    revalidateIfStale,
    revalidateOnFocus,
    revalidateOnReconnect,
    refreshInterval,
    refreshWhenHidden,
    refreshWhenOffline,
    shouldRetryOnError,
    dedupingInterval,
    focusThrottleInterval,
    loadingTimeout,
    errorRetryInterval,
    errorRetryCount,
    ...moralisConfig
  } = config;

  const swrConfig: FetchConfig = {
    revalidateOnFocus: revalidateOnFocus ?? false,
    revalidateOnMount,
    revalidateIfStale,
    revalidateOnReconnect,
    refreshInterval,
    refreshWhenHidden,
    refreshWhenOffline,
    shouldRetryOnError,
    dedupingInterval,
    focusThrottleInterval,
    loadingTimeout,
    errorRetryInterval,
    errorRetryCount,
  };

  const core = useMemo(() => {
    if (!Moralis.Core.isStarted) {
      Moralis.start(moralisConfig);
    }
    return Moralis.Core;
  }, [moralisConfig]);

  return <MoralisContext.Provider value={{ core, swrConfig }}>{children}</MoralisContext.Provider>;
};

export default MoralisProvider;
