
import {  getFeatureDomainName, queryTask } from "../helper/common_func";



export const getStatisticsForFeatsLayer = async (layerID,layerDataConfig, where = "1=1") => {
   
   let promise = new Promise((resolve, reject) => {
     let queryParams = {
       url: window.mapUrl + "/" + layerID,
       notShowLoading: true,
       returnGeometry: false,
       statistics: layerDataConfig.layerMetadata.statistics || [
         {
           type: "count",
           field: "OBJECTID",
           name: "count",
         },
       ],
       where
       // returnExecuteObject: true
     };
     queryTask({
       ...queryParams,
       callbackResult: ({ features }) => {
         if (features.length)
           resolve({ countPlusArea: features[0].attributes });
       },
       callbackError: (err) => {
         console.log(err);
         reject(err);
       },
     });
   });
   return promise;
 };
 export const getStatisticsForChart = async (layerID,layerDataConfig, where = "1=1") => {
   
   let promise = new Promise((resolve, reject) => {
     
       let queryParams = {
       url: window.mapUrl + "/" + layerID,
       notShowLoading: true,
       returnGeometry: false,
       // outFields:layerDataConfig.layerMetadata.groupByFields,
       returnDistinctValues:true,
       groupByFields:layerDataConfig.layerMetadata.groupByFields,        
       statistics:layerDataConfig.layerMetadata.statistics ,
       where: where
     };
     queryTask({
       ...queryParams,
       callbackResult: ({ features }) => {
         if (features.length)
         getFeatureDomainName(features,layerID).then(data=>{
             resolve({ data });

         })
       },
       callbackError: (err) => {
         console.log(err);
         reject(err);
       },
     });
   });
   return promise;
 };

 export const getDistictValuesForChart = async (layerID,layerDataConfig, where = "1=1") => {
   
   let promise = new Promise((resolve, reject) => {
       let queryParams = {
       url: window.mapUrl + "/" + layerID,
       notShowLoading: true,
       returnGeometry: false,
       outFields:layerDataConfig.layerMetadata.groupByFields,
       returnDistinctValues:true,
       // groupByFields:layerDataConfig.layerMetadata.groupByFields,        
       // statistics:[...statisticsFields, ...layerDataConfig.layerMetadata.statistics] ,
       where: where + " AND PARCEL_SUB_LUSE IS NOT NULL"
     };
     queryTask({
       ...queryParams,
       callbackResult: ({ features }) => {
         if (features.length)
         {
             let dict = {};
             features.map(f=>f.attributes).forEach(f=>{
               if(Object.keys(dict).includes(f.PARCEL_MAIN_LUSE)){
                   if(!dict[f.PARCEL_MAIN_LUSE].inculdes(f.PARCEL_SUB_LUSE)){
                       dict[f.PARCEL_MAIN_LUSE].push(f.PARCEL_SUB_LUSE);
                   }
               }else{
                   if( typeof dict[f.PARCEL_MAIN_LUSE]==='object')
                   dict[f.PARCEL_MAIN_LUSE].push(f.PARCEL_SUB_LUSE);
                   else
                   dict[f.PARCEL_MAIN_LUSE]=[f.PARCEL_SUB_LUSE];
               }
               
           })
           resolve({ data:dict });

         }
       },
       callbackError: (err) => {
         console.log(err);
         reject(err);
       },
     });
   });
   return promise;
 };
 export const getSubtypes = (fieldName, map, layerName) => {
  let layer = map.__mapInfo.info.$layers.layers.find(lay => lay.name === layerName);
  let subtypeFieldName = layer?.subtypeFieldName;
  let layerSubtypes = layer?.subtypes||[];
  let hasSubtype = layerSubtypes
      .find(sub => sub.domains[fieldName]?.codedValues?.length);
  if (hasSubtype&&subtypeFieldName) {
      let subTypeData = layerSubtypes.filter(sub => sub.domains[fieldName]?.codedValues?.length).
          map(sub => {
              return {
                  [subtypeFieldName]: sub.name,
                  [subtypeFieldName + "_Code"]: sub.code,
                  domains: sub.domains[fieldName].codedValues
              }
          });
      return { subTypeData, subtypeFieldName }
  } else {
      return false
  }

}
