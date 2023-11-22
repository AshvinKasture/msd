import React, { Fragment } from "react";
import TitleBar from "../../components/layout/TitleBar/TitleBar";
import CreateDeliveryChallan from "./create/CreateDeliveryChallan";
import ViewDeliveryChallan from './view/ViewDeliveryChallan';

function DeliveryChallan({ type }) {
    const modeContent = {
        CREATE: CreateDeliveryChallan,
        VIEW: ViewDeliveryChallan,
        // EDIT: EditPoMaster,
        // DELETE: DeletePoMaster,
      };
      const PageContent = modeContent[type];
  return (
    <Fragment>
      <TitleBar>Delivery Challan</TitleBar>
      <div className="w-4/5 2xl:w-2/5  mx-auto mt-24">
        <PageContent />
      </div>
    </Fragment>
  );
}

export default DeliveryChallan;
