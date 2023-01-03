
import { useEffect, useState } from "react";
import Loader from "../../containers/Loader";
import GeneralDataTable from "../../components/generalDataTable"

export default function LoadingComponent() {

    const [printBoxStyle, setPrintBox] = useState(null);
    const [showLoading, setShowLoading] = useState(false);
    const [showDataTable, setShowDataTable] = useState(false);

    useEffect(() => {
        document.addEventListener('showLoading', (event) => {

            setShowLoading(event.detail);
        });
        document.addEventListener('showPrintBox', (event) => {
            setPrintBox(event.detail);
        });
        document.addEventListener('showGeneralDataTable', (event) => {
            setShowDataTable(event.detail);
        });
    }, []);


    return (<div>
        {showLoading &&
            <Loader />}
        {printBoxStyle && printBoxStyle.show &&
            <div class="print-box hidden-print" style={printBoxStyle.style} ></div>}
        {showDataTable && showDataTable.show && <GeneralDataTable handlePrint={showDataTable.handlePrint} data={showDataTable}/>}
    </div>)

}