"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Crypto assets data
const walletAssets = [
  {
    symbol: "BTC",
    name: "Bitcoin",
    rate: 75840000,
    icon: "btc",
    balance: "2.45832100",
    unit: "BTC",
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    rate: 4950000,
    icon: "eth",
    balance: "12.45678901",
    unit: "ETH",
  },
  {
    symbol: "BNB",
    name: "BNB Chain",
    rate: 385000,
    icon: "bnb",
    balance: "45.78923456",
    unit: "BNB",
  },
  {
    symbol: "SOL",
    name: "Solana",
    rate: 246800,
    icon: "sol",
    balance: "234.56789012",
    unit: "SOL",
  },
  {
    symbol: "USDT",
    name: "Tether USD",
    rate: 1650,
    icon: "usdt",
    balance: "5,000.00",
    unit: "USDT",
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    rate: 1649,
    icon: "usdc",
    balance: "3,250.50",
    unit: "USDC",
  },
]

// Nigerian banks
const nigerianBanks = [
  { value: "access", label: "Access Bank" },
  { value: "gtb", label: "GTBank" },
  { value: "zenith", label: "Zenith Bank" },
  { value: "uba", label: "UBA" },
  { value: "fidelity", label: "Fidelity Bank" },
  { value: "fcmb", label: "FCMB" },
  { value: "sterling", label: "Sterling Bank" },
  { value: "union", label: "Union Bank" },
  { value: "wema", label: "Wema Bank" },
  { value: "polaris", label: "Polaris Bank" },
  { value: "stanbic", label: "Stanbic IBTC" },
  { value: "kuda", label: "Kuda Bank" },
  { value: "opay", label: "Opay" },
  { value: "palmpay", label: "PalmPay" },
  { value: "firstbank", label: "First Bank of Nigeria" },
]

// Verified accounts database
const verifiedAccounts: Record<string, { name: string; bank: string }> = {
  "0123456789": { name: "ADEBAYO JOHNSON OLUMIDE", bank: "GTBank" },
  "1234567890": { name: "CHIOMA BLESSING OKAFOR", bank: "Access Bank" },
  "2345678901": { name: "IBRAHIM MOHAMMED YUSUF", bank: "Zenith Bank" },
  "3456789012": { name: "FUNMILAYO GRACE ADELEKE", bank: "UBA" },
  "4567890123": { name: "EMEKA CHARLES NWOSU", bank: "Fidelity Bank" },
}

const usdToNairaRate = 1650

export default function NairaXExchange() {
  const [currentCryptoIndex, setCurrentCryptoIndex] = useState(0)
  const [accountNumber, setAccountNumber] = useState("")
  const [selectedBank, setSelectedBank] = useState("")
  const [nairaAmount, setNairaAmount] = useState("")
  const [walletConnected, setWalletConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [verifiedAccount, setVerifiedAccount] = useState<{ name: string; bank: string } | null>(null)

  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Validate bank account
  useEffect(() => {
    if (accountNumber.length === 10 && selectedBank) {
      const account = verifiedAccounts[accountNumber]
      const selectedBankLabel = nigerianBanks.find((bank) => bank.value === selectedBank)?.label

      if (account && account.bank === selectedBankLabel) {
        setVerifiedAccount(account)
      } else {
        setVerifiedAccount(null)
      }
    } else {
      setVerifiedAccount(null)
    }
  }, [accountNumber, selectedBank])

  const currentCrypto = walletAssets[currentCryptoIndex]
  const nairaValue = Number.parseFloat(nairaAmount.replace(/,/g, "")) || 0
  const cryptoAmount = nairaValue / currentCrypto.rate
  const usdAmount = nairaValue / usdToNairaRate

  const formatNairaAmount = (value: string) => {
    const numericValue = value.replace(/\D/g, "").slice(0, 12)
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  const handleNairaAmountChange = (value: string) => {
    setNairaAmount(formatNairaAmount(value))
  }

  const connectWallet = async () => {
    if (!walletConnected) {
      setIsConnecting(true)
      // Simulate wallet connection
      setTimeout(() => {
        setWalletConnected(true)
        setIsConnecting(false)
        alert(
          "Wallet connected successfully!\n\nAddress: 0x1A2B3C4D5E6F7890ABCDEF1234567890ABCDEF12\nNetwork: Multi-chain support enabled",
        )
      }, 2000)
    } else {
      setWalletConnected(false)
    }
  }

  const openContact = () => {
    alert(`📞 Contact ZirraPay Support

🕐 24/7 Live Support
📧 Email: support@zlytic.ZirraPay.com
📱 WhatsApp: +234 800 ZirraPay
💬 Telegram: @ZirraPaySupport
🌐 Website: www.zlytic.ZirraPay.com

Average response time: < 2 minutes
Languages: English, Yoruba, Hausa, Igbo`)
  }

  const executeTransfer = () => {
    if (accountNumber.length === 10 && selectedBank && nairaValue > 0) {
      alert(
        `Transaction initiated!\n\nSending: ${cryptoAmount.toFixed(8)} ${currentCrypto.symbol}\nReceiving: ₦${nairaValue.toLocaleString()}\nAccount: ${accountNumber}\nBank: ${nigerianBanks.find((b) => b.value === selectedBank)?.label}`,
      )
    }
  }

  const isFormValid = accountNumber.length === 10 && selectedBank && nairaValue > 0

  return (
    <div className="min-h-screen bg-[#0b0e11] text-white overflow-x-hidden relative">
      {/* Background Effects */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-0">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Animated Market Indicators */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute w-[300px] h-[300px] rounded-full blur-[100px] opacity-15 animate-pulse top-[10%] right-[10%] bg-gradient-to-br from-green-500 to-green-800" />
        <div className="absolute w-[300px] h-[300px] rounded-full blur-[100px] opacity-15 animate-pulse bottom-[10%] left-[10%] bg-gradient-to-br from-blue-600 to-blue-900 animation-delay-[4s]" />
        <div className="absolute w-[300px] h-[300px] rounded-full blur-[100px] opacity-15 animate-pulse top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-amber-400 to-orange-500 animation-delay-[2s]" />
      </div>

      {/* Header Strip */}
      <div className="fixed top-0 w-full h-1 bg-gradient-to-r from-blue-800 via-blue-600 to-blue-900 z-[1000]" />

      {/* Navigation */}
      <nav className="fixed top-1 w-full bg-slate-900/95 backdrop-blur-xl border-b border-white/10 z-[999] py-4">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-amber-400 rounded-xl flex items-center justify-center font-bold text-sm">
              ZP
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-amber-400 bg-clip-text text-transparent">
              ZirraPay
            </span>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={openContact}
              className="border-white/10 bg-white/5 hover:bg-white/10 hover:border-amber-400/40"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="mr-2">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
              </svg>
              Contact Us
            </Button>
            <Button
              onClick={connectWallet}
              disabled={isConnecting}
              className={`${
                walletConnected
                  ? "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                  : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
              }`}
            >
              {isConnecting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                  Connecting...
                </>
              ) : walletConnected ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="mr-2">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                  0x1A2B...3C4D
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="mr-2">
                    <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
                  </svg>
                  Connect Wallet
                </>
              )}
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <div className="relative z-10 max-w-3xl mx-auto px-6 pt-24 pb-10 min-h-screen">
        {/* Exchange Panel */}
        <div className="bg-gradient-to-br from-slate-900/98 to-blue-900/5 backdrop-blur-3xl border border-white/12 rounded-3xl p-10 relative shadow-2xl">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 via-amber-400 to-green-500 rounded-t-3xl" />

          {/* Header */}
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-amber-400 rounded-xl flex items-center justify-center font-black text-white">
                ZP
              </div>
              <div className="text-3xl font-black bg-gradient-to-r from-blue-600 via-amber-400 to-green-500 bg-clip-text text-transparent">
                ZirraPay
              </div>
            </div>
            <div className="text-slate-400 text-sm font-medium">Professional Cryptocurrency Exchange</div>
            <div className="flex justify-center gap-4 mt-4">
              {["SSL Secured", "CBN Registered", "KYC Verified"].map((badge) => (
                <div
                  key={badge}
                  className="bg-green-500/10 border border-green-500/30 rounded-full px-3 py-1 text-xs text-green-400 font-semibold uppercase tracking-wider"
                >
                  {badge}
                </div>
              ))}
            </div>
          </div>

          {/* Step 1: Crypto Selection */}
          <div className="mb-7">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-blue-400 rounded-full flex items-center justify-center text-xs font-bold text-white">
                1
              </div>
              <div className="text-lg font-bold">Select Asset from Wallet</div>
            </div>
            <div className="bg-black/40 border-2 border-white/8 rounded-2xl p-6 hover:border-blue-600/30 transition-all duration-300">
              <div className="text-xs text-slate-400 mb-4 font-semibold uppercase tracking-wider">Choose Asset</div>
              <div className="relative" ref={dropdownRef}>
                <div
                  className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl p-4 cursor-pointer hover:bg-white/8 hover:border-blue-600/40 transition-all duration-200"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white crypto-logo-${currentCrypto.icon}`}
                  >
                    {currentCrypto.symbol}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold">{currentCrypto.symbol}</div>
                    <div className="text-xs text-slate-500">{currentCrypto.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-green-400">
                      {currentCrypto.balance} {currentCrypto.unit}
                    </div>
                  </div>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className={`opacity-50 transition-transform duration-300 ${dropdownOpen ? "rotate-180" : ""}`}
                  >
                    <path d="M7 10l5 5 5-5z" />
                  </svg>
                </div>

                {dropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900/98 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
                    {walletAssets.map((asset, index) => (
                      <div
                        key={asset.symbol}
                        className="flex items-center gap-4 p-4 cursor-pointer hover:bg-blue-600/10 transition-all duration-200 border-b border-white/5 last:border-b-0"
                        onClick={() => {
                          setCurrentCryptoIndex(index)
                          setDropdownOpen(false)
                        }}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white crypto-logo-${asset.icon}`}
                        >
                          {asset.symbol}
                        </div>
                        <div className="flex-1">
                          <div className="font-bold">{asset.symbol}</div>
                          <div className="text-xs text-slate-500">{asset.name}</div>
                        </div>
                        <div className="text-sm font-semibold text-green-400">
                          {asset.balance} {asset.unit}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Step 2: Bank Details */}
          <div className="mb-7">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-blue-400 rounded-full flex items-center justify-center text-xs font-bold text-white">
                2
              </div>
              <div className="text-lg font-bold">Bank Account Details</div>
            </div>
            <div className="bg-black/40 border-2 border-white/8 rounded-2xl p-6 hover:border-blue-600/30 transition-all duration-300">
              <div className="text-xs text-slate-400 mb-4 font-semibold uppercase tracking-wider">
                Account Information
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Input
                  type="text"
                  placeholder="Enter 10-digit account number"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  className="bg-transparent border-0 border-b-2 border-white/10 rounded-none text-lg font-semibold focus:border-blue-600 transition-colors"
                />
                <Select value={selectedBank} onValueChange={setSelectedBank}>
                  <SelectTrigger className="bg-white/5 border-2 border-white/10 rounded-xl text-sm font-semibold focus:border-blue-600">
                    <SelectValue placeholder="Select Bank" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900/98 backdrop-blur-xl border-white/10">
                    {nigerianBanks.map((bank) => (
                      <SelectItem key={bank.value} value={bank.value} className="text-white hover:bg-blue-600/10">
                        {bank.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {verifiedAccount && (
                <div className="bg-gradient-to-r from-green-500/10 to-green-500/5 border border-green-500/30 rounded-xl p-4 flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                    ✓
                  </div>
                  <div>
                    <div className="font-bold text-green-400">{verifiedAccount.name}</div>
                    <div className="text-xs text-slate-500">{verifiedAccount.bank}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Step 3: Amount */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-blue-400 rounded-full flex items-center justify-center text-xs font-bold text-white">
                3
              </div>
              <div className="text-lg font-bold">Amount to Receive</div>
            </div>
            <div className="bg-black/40 border-2 border-white/8 rounded-2xl p-6 hover:border-blue-600/30 transition-all duration-300">
              <div className="text-xs text-slate-400 mb-4 font-semibold uppercase tracking-wider">Naira Amount</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                <Input
                  type="text"
                  placeholder="0.00"
                  value={nairaAmount}
                  onChange={(e) => handleNairaAmountChange(e.target.value)}
                  className="bg-transparent border-0 border-b-2 border-white/10 rounded-none text-3xl font-bold focus:border-blue-600 transition-colors"
                />
                <div className="text-right md:text-right">
                  <div className="text-xs text-slate-500 mb-2 uppercase tracking-wider">USD Equivalent</div>
                  <div className="text-lg font-bold text-amber-400">${usdAmount.toFixed(2)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Transaction Summary */}
          <div className="bg-black/30 border border-white/5 rounded-2xl p-6 mb-8">
            <div className="text-sm font-bold text-slate-400 mb-5 text-center">Transaction Summary</div>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-3 border-b border-white/5">
                <span className="text-sm text-slate-500">You Send</span>
                <span className="text-sm font-semibold">
                  {cryptoAmount.toFixed(8)} {currentCrypto.symbol}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-white/5">
                <span className="text-sm text-slate-500">Exchange Rate</span>
                <span className="text-sm font-semibold">
                  1 {currentCrypto.symbol} = ₦{currentCrypto.rate.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-white/5">
                <span className="text-sm text-slate-500">Network Fee</span>
                <span className="text-sm font-semibold">₦500</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-white/5">
                <span className="text-sm text-slate-500">Processing Time</span>
                <span className="text-sm font-semibold">3-7 minutes</span>
              </div>
              <div className="flex justify-between items-center pt-5 mt-3 border-t-2 border-white/10 font-bold">
                <span className="text-sm">You Receive</span>
                <span className="text-sm">₦{nairaValue.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Transfer Button */}
          <Button
            onClick={executeTransfer}
            disabled={!isFormValid}
            className="w-full bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 hover:from-blue-700 hover:via-blue-600 hover:to-blue-800 text-white font-bold py-5 text-lg uppercase tracking-wider rounded-2xl transition-all duration-300 hover:shadow-2xl hover:shadow-blue-600/40 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isFormValid ? "Proceed to Exchange" : "Complete Account Verification"}
          </Button>
        </div>
      </div>

      <style jsx>{`
        .crypto-logo-btc {
          background: linear-gradient(135deg, #f7931a, #ffb547);
        }
        .crypto-logo-eth {
          background: linear-gradient(135deg, #627eea, #8a92b2);
        }
        .crypto-logo-bnb {
          background: linear-gradient(135deg, #f3ba2f, #f0b90b);
        }
        .crypto-logo-sol {
          background: linear-gradient(135deg, #9945ff, #14f195);
        }
        .crypto-logo-usdt {
          background: linear-gradient(135deg, #26a17b, #50af95);
        }
        .crypto-logo-usdc {
          background: linear-gradient(135deg, #2775ca, #4c9aff);
        }
      `}</style>
    </div>
  )
}
