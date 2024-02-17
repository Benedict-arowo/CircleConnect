import * as React from 'react';
import {Box} from '@mui/material';
import {Modal} from '@mui/material';
import {Button} from '@mui/material';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  }


  interface Props {
    text: string;
    onClick: () => void;
    text2: string;
    text3: string;
    textp: string;
  }

const ChildModal : React.FC<Props> = (props)  => {
    const {text, onClick, text2,  text3, textp} = props
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };



  return (
    <React.Fragment>
      <Button onClick={handleOpen} color="error">{text}</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ ...style, width: 500 }}>
          <h1 className='font-bold font-sans text-base'>{text3}</h1>
          <p className=' font-normal font-sans'>{textp}</p>
          <div className='mt-5 flex justify-evenly'>
          <Button onClick={onClick}  color="error">{text2}</Button>
          <Button onClick={handleClose}>Cancle</Button>     
          </div>
        </Box>
      </Modal>
    </React.Fragment>
  );
}


export default ChildModal