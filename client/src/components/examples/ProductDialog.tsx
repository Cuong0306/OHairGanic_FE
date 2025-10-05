import { useState } from 'react'
import ProductDialog from '../ProductDialog'
import { Button } from '@/components/ui/button'

export default function ProductDialogExample() {
  const [open, setOpen] = useState(false)

  return (
    <div className="p-4">
      <Button onClick={() => setOpen(true)}>Open Dialog</Button>
      <ProductDialog
        open={open}
        onOpenChange={setOpen}
        onSave={(product) => console.log('Saved product:', product)}
      />
    </div>
  )
}
