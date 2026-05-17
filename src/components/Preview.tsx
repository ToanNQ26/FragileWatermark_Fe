interface Props {
  file: File | null;
}

const Preview: React.FC<Props> = ({ file }) => {
  if (!file) return null;

  return (
    <img
      src={URL.createObjectURL(file)}
      alt="preview"
      width={300}
    />
  );
};

export default Preview;