import { Button } from '../Components/Button'
import { PlusIcon } from '../icons/PlusIcon'
import { ShareIcon } from '../icons/ShareIcon'
import { Card } from '../Components/Card'
import { Model } from '../Components/Model'
import { ShareAlert } from '../Components/ShareAlert'
import { useEffect, useState } from 'react'
import { Sidebar } from '../Components/Sidebar'
import { useContent } from '../hooks/useContent'
import axios from 'axios'
import { BACKEND_URL } from './config'


export function Dashboard() {
  const [modelOpen, setModelOpen] = useState(false);
  const [shareAlertOpen, setShareAlertOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const {contents, Refresh} = useContent();
  const [selectedType, setSelectedType] = useState<string | null>(null);

  useEffect(()=>{
    Refresh();
  }, [modelOpen])

  const filteredContents = selectedType ? contents.filter((c:any)=> c.type === selectedType) : contents;

  return <div>

    <div className="p-4 ml-72 min-h-screen bg-gray-100 border-2">

      <Sidebar onFilterClick={setSelectedType}  selectedType={selectedType} />

        <Model open={modelOpen} onClose={()=>{
          setModelOpen(false);
        }}/>
        
        <ShareAlert 
          isOpen={shareAlertOpen} 
          onClose={() => setShareAlertOpen(false)}
          shareUrl={shareUrl}
        />

      <div className="flex justify-end gap-4">
       <Button variant="primary" text="Add content" startIcon={<PlusIcon/>} onClick={()=>{setModelOpen(true)}}/>
       <Button onClick={async()=>{
        try {
          const response = await axios.post(`${BACKEND_URL}/api/v1/brain/share`,{
            share: true
          },{
            headers: {
              "Authorization" : `Bearer ${localStorage.getItem("token")}`
            }
          });
          const url = `http://localhost:5173/share/${response.data.hash}`;
          setShareUrl(url);
          setShareAlertOpen(true);
        } catch (error: any) {
          console.error("Error sharing brain:", error);
          alert("Failed to share brain. Please try again.");
        }
       }} variant="secondary" text="Share Brain" startIcon={<ShareIcon/>}/>

      </div>
      
      <div className="flex gap-4 flex-wrap mt-4">
        {filteredContents && filteredContents.length > 0 ? (
          filteredContents.map((content: any, index: number) => (
            <Card 
              key={index}
              type={content.type} 
              link={content.link} 
              title={content.title}
            />
          ))
        ) : (
          <div className="w-full text-center text-gray-500 mt-8">
            No content found. Add some content to get started!
          </div>
        )}
      </div>

    </div>
        </div>

}

export default Dashboard
