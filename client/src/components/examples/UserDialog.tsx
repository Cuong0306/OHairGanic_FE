import { useState } from 'react'
import UserDialog from '../UserDialog'
import { Button } from '@/components/ui/button'

export default function UserDialogExample() {
  const [open, setOpen] = useState(false)

  return (
    <div className="p-4">
      <Button onClick={() => setOpen(true)}>Open Dialog</Button>
      <UserDialog
        open={open}
        onOpenChange={setOpen}
        onSave={(user) => console.log('Saved user:', user)}
      />
    </div>
  )
}
