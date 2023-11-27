import { Alert, Button, Modal, Spinner } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

type Props = {
  openModal: boolean;
  setOpenModal: (value: boolean) => void;
  textContent: string;
  onDelete: () => void;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

const PopupModal = ({openModal, setOpenModal, textContent, onDelete, isLoading, error, clearError}: Props) => {

  return (
    <>
      <Modal show={openModal} size="md" onClose={() => {
        setOpenModal(false);
        clearError();
      }} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              {textContent}
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={() => {
                clearError();
                onDelete();
              }}>
                <span className={isLoading ? 'pr-3' : ''}>{isLoading ? 'Loading...' : 'Yes I\'m sure'}</span>
                {isLoading && <Spinner color="info" aria-label="Spinner button example" size="sm"/>}
              </Button>
              <Button color="indigo" onClick={() => {
                setOpenModal(false);
                clearError();
              }}>
                No, cancel
              </Button>
            </div>
          </div>
          {error && (
            <Alert color="failure" className="w-full mt-3">
              <span className="font-medium">{error}</span>
            </Alert>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default PopupModal;