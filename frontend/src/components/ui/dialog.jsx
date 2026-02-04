'use client'

import { Dialog as ChakraDialog, Portal } from '@chakra-ui/react'
import { forwardRef } from 'react'

export const DialogRoot = ChakraDialog.Root
export const DialogTrigger = ChakraDialog.Trigger

export const DialogContent = forwardRef(
  function DialogContent(props, ref) {
    const { children, ...rest } = props
    return (
      <Portal>
        <ChakraDialog.Backdrop />
        <ChakraDialog.Positioner display="flex" alignItems="center" justifyContent="center">
          <ChakraDialog.Content ref={ref} {...rest}>
            {children}
          </ChakraDialog.Content>
        </ChakraDialog.Positioner>
      </Portal>
    )
  },
)

export const DialogCloseTrigger = ChakraDialog.CloseTrigger
export const DialogHeader = ChakraDialog.Header
export const DialogBody = ChakraDialog.Body
export const DialogFooter = ChakraDialog.Footer
