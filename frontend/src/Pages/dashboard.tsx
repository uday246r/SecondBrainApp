import { Button } from '../Components/Button'
import { PlusIcon } from '../icons/PlusIcon'
import { ShareIcon } from '../icons/ShareIcon'
import { Card } from '../Components/Card'
import { Model } from '../Components/Model'
import { useState } from 'react'
import { Sidebar } from '../Components/Sidebar'


export function Dashboard() {
  const [modelOpen, setModelOpen] = useState(false);
  return <div>

  <Sidebar/>

    <div className="p-4 ml-72 min-h-screen bg-gray-100 border-2">

        <Model open={modelOpen} onClose={()=>{
          setModelOpen(false);
        }}/>

      <div className="flex justify-end gap-4">
       <Button variant="primary" text="Add content" startIcon={<PlusIcon/>} onClick={()=>{setModelOpen(true)}}/>
       <Button variant="secondary" text="Share Brain" startIcon={<ShareIcon/>}/>

      </div>
      
      <div className="flex gap-4">
        <Card type="twitter" link="https://x.com/Uday246r/status/1948806795595841671" title="Industrial visit to NIPER Mohali"/>
        <Card type="youtube" link="https://www.youtube.com/watch/munvAvqZgIs?si=AV2QZSoaFcnlnQzG" title="KOKO eating Bananas"/>
      </div>

    </div>
        </div>

}

export default Dashboard
