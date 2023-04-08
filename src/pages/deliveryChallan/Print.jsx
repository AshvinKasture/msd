import React from 'react';
import logo from '../../assets/logo.jpg';

function Print() {
  const height = '95vh';
  const width = `calc(${height.substring(0, 2)}vh / 1)`;
  //   const width = `50vw`;
  //   const height = `calc(${width.substring(0, 2)}vw / 0.9)`;
  //   const width = '210mm';
  //   const height = '297mm';
  const borderStyle = 'border border-black border-collapse';

  return (
    <div
      className='w-screen h-screen bg-gray-200 flex justify-center items-center'
      onKeyDown={(e) => {
        if (e.shiftKey && e.key == 'P') {
          printModule.printPage();
          alert('Done');
        }
      }}
      tabIndex='0'
    >
      <div
        className=' border-black bg-white text-xs flex flex-col items-center'
        style={{
          height: height,
          width: width,
          // margin: auto,
        }}
      >
        <div className='flex justify-evenly'>
          <img src={logo} alt='logo' className='w-16 h-16' />
          <div className='flex flex-col text-center'>
            <div className='font-bold text-xl'>Avi Electric Motors</div>
            <div className=''>
              <div>Plot No. A-72, MIDC, Ahmednagar - 414 111</div>
              <div className='flex'>
                <div>www.aviemotors.com</div>
                <div className='ml-2'>email - info@aviemotors.com</div>
              </div>
              <div className='flex'>
                <div>Mobile : 9168403232</div>
                <div className='ml-2 font-bold'>GSTIN - 271CSPK2836L1Z0</div>
              </div>
            </div>
          </div>
        </div>
        <div className='mt-2 font-bold bg-black text-white px-2 rounded-md'>
          Delivery Challan
        </div>
        <table id='table' className={`mt-2 mx-10 w-11/12 ${borderStyle}`}>
          <thead>
            <tr className={`${borderStyle}`}>
              <th className={`w-1/2 font-normal ${borderStyle}`}>
                <div className='flex justify-start gap-2'>
                  <span>M/S</span>
                  <span>AshTech</span>
                </div>
              </th>
              <th className={`w-1/2 font-normal px-2 py-1 ${borderStyle}`}>
                <div className='flex flex-col gap-1'>
                  <div className='flex justify-between'>
                    <div className='flex gap-5'>
                      <span>Challan No :</span>
                      <span>1</span>
                    </div>
                    <div className='flex gap-5'>
                      <span>Date :</span>
                      <span>07/04/2023</span>
                    </div>
                  </div>
                  <div className='flex justify-between'>
                    <div className='flex gap-5'>
                      <span>PO No :</span>
                      <span>5001</span>
                    </div>
                    <div className='flex gap-5'>
                      <span>Date :</span>
                      <span>07/04/2023</span>
                    </div>
                  </div>
                  <div className='flex gap-5'>
                    <span>Vendor Code :</span>
                    <span>1234</span>
                  </div>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={`${borderStyle}`}>
                <table className={`w-full`}>
                  <thead>
                    <tr className={``}>
                      <th className={`${borderStyle}`}>Sr. No.</th>
                      <th className={`${borderStyle}`}>Description</th>
                    </tr>
                  </thead>
                </table>
              </td>
              <td className={`${borderStyle}`}>
                <table className={`w-full`}>
                  <thead>
                    <tr>
                      <th className={`${borderStyle}`}>Item No.</th>
                      <th className={`${borderStyle}`}>Qt.</th>
                      <th className={`${borderStyle}`}>Value</th>
                      <th className={`${borderStyle}`}>Remark</th>
                    </tr>
                  </thead>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Print;
