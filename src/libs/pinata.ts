import axios from 'axios';

export async function piniataUploadFile(file: File) {
    const formData = new FormData();

    formData.append('file', file);
    
    const pinataMetadata = JSON.stringify({
      name: file.name,
    });
    formData.append("pinataMetadata", pinataMetadata);

    const pinataOptions = JSON.stringify({
      cidVersion: 1,
    });
    formData.append("pinataOptions", pinataOptions);

    const res = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT}`,
        },
      }
    );

    const uri = import.meta.env.VITE_PINATA_GATEWAY + res.data.IpfsHash;
    
    return {uri, hash: res.data.IpfsHash};
}

export async function piniataUploadJson(text: string, filename: string, mime?: string) {
    if (!mime) {
        mime = "text/plain";
    }
    const blob = new Blob([text], { type: mime });
    const file = new File([blob], filename)
    const formData = new FormData();
    formData.append("file", file);

    const res = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT}`,
          },
        }
      );
      
    const uri = import.meta.env.VITE_PINATA_GATEWAY + res.data.IpfsHash;
    
    return {uri, hash: res.data.IpfsHash};
}