export const OPERATIONS =   [
    {
      name: "equal",
      operation: "=",
      key: [
        "esriFieldTypeInteger",
        "esriFieldTypeDouble",
        "esriFieldTypeString",
        'esriFieldTypeDate',
        "esriFieldTypeSmallInteger"
      ],
      forDomain: true,
    },
    {
      name: "not",
      operation: "<>",
      key: ["esriFieldTypeInteger", "esriFieldTypeDouble","esriFieldTypeSmallInteger",'esriFieldTypeDate'],
      forDomain: true,
    },
    {
      name: "lessOrEqual",
      operation: ">=",
      key: ["esriFieldTypeInteger", "esriFieldTypeDouble","esriFieldTypeSmallInteger"],
    },
    {
      name: "lessthan",
      operation: "<",
      key: ["esriFieldTypeInteger", "esriFieldTypeDouble","esriFieldTypeSmallInteger"],
    },
    {
      name: "morethan",
      operation: ">",
      key: ["esriFieldTypeInteger", "esriFieldTypeDouble","esriFieldTypeSmallInteger"],
    },
    {
      name: "isNull",
      operation: "is null",
      key: [
        "esriFieldTypeInteger",
        "esriFieldTypeDouble",
        "esriFieldTypeString",
        'esriFieldTypeDate',
        "esriFieldTypeSmallInteger"
      ],
      forDomain: true,
    },
    {
      name: "notNull",
      operation: "is not null",
      key: [
        "esriFieldTypeString",
        "esriFieldTypeInteger",
        "esriFieldTypeDouble",
        "esriFieldTypeSmallInteger",
        'esriFieldTypeDate',
      ],
    },
    { name: "includes", operation: "like", key: ["esriFieldTypeString"] },
    { name:'dateAfter', operation:">=", key:['esriFieldTypeDate'] },
    { name:'dateBefore', operation:"<=", key:['esriFieldTypeDate'] }
  ]; 

export const tblDataBtns = {
  ownershipAttrTbl:'ownershipAttrTbl',
  royalDataAttrTbl:'royalDataAttrTbl',
  ParcelConditionsBtn:'ParcelConditionsBtn',
  ParcelLicenseBtn:'ParcelLicenseBtn',
  ShopLicenseBtn:'ShopLicenseBtn',
  LandbaseParcelBtn:'LandbaseParcelBtn',
  farzSubmissions:"farzSubmissions",
  krokySubmissions:"krokySubmissions",
  updateContractSubmissions:"updateContractSubmissions"
}

export const externalBtnsForTblData = {
  zoomBtn:'zoomBtn',
  exportAttrTbl:'exportAttrTbl',
  exportKmlAttrTbl:'exportKmlAttrTbl',
  googleMapsAttrTbl:'googleMapsAttrTbl',
  exportXlAttrTbl:'exportXlAttrTbl',
  exportCadAttrTbl:'exportCadAttrTbl',
  exportShpAttrTbl:'exportShpAttrTbl',
  exportPdfAttrTbl:'exportPdfAttrTbl',
  filterAttrTblBtn:'filterAttrTblBtn',
  statisticsAttrTbl:'statisticsAttrTbl'
}