import UploadWizard from './UploadWizard'
import MyOrders from './MyOrders'

function StorageTab({ ipfs }) {
  return (
    <>
      <UploadWizard ipfs={ipfs} />
      <MyOrders />
    </>
  )
}

export default StorageTab
