import { useEffect, useState } from "react";
import { WebContainer } from '@webcontainer/api';

export function useWebContainer() {
    const [webcontainer, setWebcontainer] = useState<WebContainer>();
    const [fs, setFs] = useState<WebContainer['fs'] | null>(null);
    

    async function main() {
        const webcontainerInstance = await WebContainer.boot();
        setWebcontainer(webcontainerInstance);
        setFs(webcontainerInstance.fs);
      
    }
    useEffect(() => {
        main();
    }, [])

    return {webcontainer, fs};
}