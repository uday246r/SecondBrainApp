import { useState } from 'react'
import { Button } from './Components/Button'
import { PlusIcon } from './icons/PlusIcon'
import { ShareIcon } from './icons/ShareIcon'
import { Card } from './Components/Card'


function App() {

  return (
    <div className="p-4">
      <div className="flex justify-end gap-4">
       <Button variant="primary" text="Add content" startIcon={<PlusIcon/>}/>
       <Button variant="secondary" text="Share Brain" startIcon={<ShareIcon/>}/>

      </div>
      
      <div className="flex gap-4">
        <Card type="twitter" link="https://x.com/Uday246r/status/1948806795595841671" title="Industrial visit to NIPER Mohali"/>
        <Card type="youtube" link="https://www.youtube.com/watch/munvAvqZgIs?si=AV2QZSoaFcnlnQzG" title="KOKO eating Bananas"/>
      </div>
     
    </div>
  )
}

export default App
