interface Props {
  onUpload: (file: File) => void;
}

const ImageUpload: React.FC<Props> = ({ onUpload }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    onUpload(e.target.files[0]);
  };

  return <input type="file" onChange={handleChange} />;
};

export default ImageUpload;