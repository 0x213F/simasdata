'use client'

import { useState } from 'react'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { CheckCircle } from 'lucide-react'
import { useContactSubmissionStore } from '@/lib/stores/contact-submission-store'

interface ContactDrawerProps {
  children: React.ReactNode
}

export default function ContactDrawer({ children }: ContactDrawerProps) {
  const [text, setText] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const { createContactSubmission, loading, error } = useContactSubmissionStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!text.trim()) return

    const success = await createContactSubmission(text)

    if (success) {
      setText('')
      setShowSuccess(true)
      setTimeout(() => {
        setShowSuccess(false)
        setIsOpen(false)
      }, 3500)
    }
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      setText('')
      setShowSuccess(false)
    }
  }

  return (
    <Drawer open={isOpen} onOpenChange={handleOpenChange}>
      <DrawerTrigger asChild>
        {children}
      </DrawerTrigger>
      <DrawerContent className="max-h-[90vh] flex flex-col">
        {showSuccess ? (
          <div className="flex-1 flex items-center justify-center py-12 px-6">
            <div className="text-center max-w-md">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-6" />
              <div className="text-lg font-light text-gray-900 mb-3">
                Thanks for your message
              </div>
              <div className="text-sm text-gray-500 font-light">
                If there is a good match we will be in touch quickly
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center px-6">
            <div className="w-full max-w-md">
              <DrawerHeader className="text-left py-6 px-0">
                <DrawerTitle className="text-lg font-light tracking-wide mb-2">
                  Tell us what's on your mind
                </DrawerTitle>
                <DrawerDescription className="text-sm text-gray-500 font-light">
                  Whether you're interested in acquiring work or<br />simply wish to connect.
                </DrawerDescription>
              </DrawerHeader>

              <div className="flex-1 flex flex-col pb-8 min-h-0">
                <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
                  <div className="flex-1 mb-6 min-h-0">
                    <textarea
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Type your message here..."
                      className="w-full h-32 min-h-[8rem] p-4 rounded-lg resize-none focus:outline-none text-sm font-light contact-textarea"
                      style={{
                        border: '1px solid rgba(0, 0, 0, 0.08)'
                      }}
                      disabled={loading}
                      autoFocus
                    />
                    {error && (
                      <div className="mt-3 text-sm text-red-500 font-light">
                        {error}
                      </div>
                    )}
                  </div>

                  <DrawerFooter className="flex-row justify-end items-center gap-8 p-0 mt-auto">
                    <DrawerClose asChild>
                      <button
                        type="button"
                        className="text-sm font-light text-gray-500 hover:text-gray-700 transition-colors underline-offset-4 hover:underline cursor-pointer"
                        disabled={loading}
                      >
                        Cancel
                      </button>
                    </DrawerClose>
                    <button
                      type="submit"
                      className="px-6 py-2 text-sm font-light text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      disabled={loading || !text.trim()}
                    >
                      {loading ? 'Sending...' : 'Send Message'}
                    </button>
                  </DrawerFooter>
                </form>
              </div>
            </div>
          </div>
        )}
      </DrawerContent>
    </Drawer>
  )
}