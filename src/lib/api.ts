import { supabase } from './supabase'

// Agent related functions
export const activateAgent = async (userWallet: string, agentId: string) => {
  const { data, error } = await supabase.functions.invoke('activate-agent', {
    body: { userWallet, agentId }
  })

  if (error) throw error
  return data
}

export const getUserAgents = async (userWallet: string) => {
  const { data, error } = await supabase
    .from('user_agents')
    .select(`
      *,
      ai_agents (*)
    `)
    .eq('user_wallet', userWallet)

  if (error) throw error
  return data
}

// Portfolio functions
export const getUserPortfolio = async (userWallet: string) => {
  const { data, error } = await supabase
    .from('user_portfolios')
    .select('*')
    .eq('user_wallet', userWallet)
    .single()

  if (error) throw error
  return data
}

// Transaction functions
export const getRecentTransactions = async (limit: number = 10) => {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data
}

export const getUserTransactions = async (userWallet: string) => {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_wallet', userWallet)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export const getTransactionCounts = async () => {
  const { data, error } = await supabase
    .from('transactions')
    .select('status')

  if (error) throw error

  const counts = {
    pending: 0,
    processing: 0,
    success: 0,
    error: 0
  }

  data.forEach((tx: any) => {
    if (counts[tx.status as keyof typeof counts] !== undefined) {
      counts[tx.status as keyof typeof counts]++
    }
  })

  return counts
}

// Pool functions
export const createDeposit = async (amount: string, privacyLevel: string, userWallet: string) => {
  const { data, error } = await supabase.functions.invoke('create-deposit', {
    body: { amount, privacyLevel, userWallet }
  })

  if (error) throw error
  return data
}

export const generateStealthAddress = async (userWallet: string) => {
  const { data, error } = await supabase.functions.invoke('generate-stealth-address', {
    body: { userWallet }
  })

  if (error) throw error
  return data
}

export const getPoolStatistics = async () => {
  const { data, error } = await supabase.functions.invoke('get-pool-stats')

  if (error) throw error
  return { success: true, data }
}