"use client"

import { Button } from "@/components/ui/button"
import { Wallet } from "lucide-react"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function ConnectWalletButton() {
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")

  const connectWallet = () => {
    // Simulate wallet connection
    const randomAddress =
      "0x" + Math.random().toString(16).slice(2, 10) + "..." + Math.random().toString(16).slice(2, 6)
    setWalletAddress(randomAddress)
    setIsConnected(true)
  }

  const disconnectWallet = () => {
    setIsConnected(false)
    setWalletAddress("")
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="ml-auto">
          <Wallet className="mr-2 h-4 w-4" />
          {isConnected ? walletAddress : "Connect Wallet"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isConnected ? "Wallet Connected" : "Connect Your Wallet"}</DialogTitle>
          <DialogDescription>
            {isConnected
              ? "Your wallet is connected to FreelanceHub."
              : "Connect your wallet to access all features of FreelanceHub."}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col space-y-4 py-4">
          {isConnected ? (
            <>
              <div className="flex flex-col space-y-2">
                <span className="text-sm text-muted-foreground">Wallet Address</span>
                <span className="font-mono">{walletAddress}</span>
              </div>
              <div className="flex flex-col space-y-2">
                <span className="text-sm text-muted-foreground">Balance</span>
                <span className="font-bold">{(Math.random() * 10).toFixed(4)} ETH</span>
              </div>
              <Button variant="destructive" onClick={disconnectWallet}>
                Disconnect Wallet
              </Button>
            </>
          ) : (
            <div className="grid gap-4">
              <Button onClick={connectWallet} className="w-full">
                <Wallet className="mr-2 h-4 w-4" />
                Connect MetaMask
              </Button>
              <Button variant="outline" onClick={connectWallet} className="w-full">
                Connect WalletConnect
              </Button>
              <Button variant="outline" onClick={connectWallet} className="w-full">
                Connect Coinbase Wallet
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
