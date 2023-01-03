import {
  faBorderAll,
  faBuilding,
  faFilePdf,
  faInfo,
  faSearchPlus,
  faSitemap,
  faCartPlus,
  faUser,
  faFileAlt,
} from "@fortawesome/free-solid-svg-icons";
import i18n from '../i18n';
import kroky from "../assets/images/kroky.svg";
import splitIcon from "../assets/images/splitIcon.svg";
import updateContract from "../assets/images/updateContracts.svg";
import zwa2dTnzemya from "../assets/images/zwa2dIcon.svg";
import mshare3Icon from "../assets/images/mshare3.svg";

export const loginLayersSetting = {
  incidents940: {
    name: "البلاغات",
    isPublicSearchable: true,
    displayField: "LOCATION_ID",
    isSearchable: true,
    outFields: [
      "OBJECTID",
      "MUNICIPALITY_NAME",
      "SUB_MUNICIPALITY_NAME",
      "LOCATION_NAME",
      "LOCATION_ID",
      "DISTRICT_NAME",
      "STREET_FULLNAME",
      "INCIDENT_STATUS",
      "CLASSIFICATION_NAME",
      "TICKET_NUMBER",
      "CREATED_DATE",
      "CLOSED_DATE",
      "LATITUDE",
      "LONGITUDE",
    ],
    aliasOutFields: [
     "munName",
     "subMunName",
     "locationName",
    "reportNum",
    "districtName",
     "streetName",
     "reportStatus",
     "reportClassification",
     "orderNum",
    "dateCreated",
     "closeDate",
   "latitude",
   "longitude",
    ],
    searchFields: [
      {
        field: "MUNICIPALITY_NAME",
        alias:"munName",
        zoomLayer: {
          name: "Municipality_Boundary",
          filterField: "MUNICIPALITY_NAME",
        },
      },
      {
        field: "SUB_MUNICIPALITY_NAME",
        alias:"subMunName",
        zoomLayer: {
          name: "Sub_Municipality_Boundary",
          filterField: "SUB_MUNICIPALITY_NAME",
        },
      },
      {
        field: "DISTRICT_NAME",
        alias:"districtName",
        zoomLayer: { name: "District_Boundary", filterField: "DISTRICT_NAME" },
      },

      {
        field: "STREET_FULLNAME",
        alias:"streetName",
        zoomLayer: { name: "Street_Naming", filterField: "STREET_FULLNAME" },
      },
      { field: "INCIDENT_STATUS", alias:"reportStatus" },
      { field: "LOCATION_ID", alias:"reportNum", isSearch: true },
      { field: "CREATED_DATE", alias:"from", isDate: true, operator: ">=" },
      {
        field: "CLOSED_DATE",
        alias:"to",
        isDate: true,
        operator: "<=",
        isEndDate: true,
      },
    ],
    dashboardCharts:[
      
      {
        name:'MUNICIPALITY_NAME',
        alias:'incidentNuPermuniciplityName',
        chartType:'donut',
        position:'top',
        shownData:['count']
      },
 
      {
        name:'INCIDENT_STATUS',
        alias:'incidentStatus',
        chartType:'pie',
        position:'bottom',
        shownData:['count']
      }
    
    ]
  },
  Deformation_Sites: {
    isSearchable: true,
    name:"التشوه البصري",
    isHidden: true,
    outFields: [
      "OBJECTID",
      "MUNICIPALITY_NAME",
      "SUB_MUNICIPALITY_NAME",
      "CITY_NAME",
      "DISTRICT_NAME",
      "REMARKS",
      "DEFORMATION_TYPE",
      "STREET_NAME",
    ],
    aliasOutFields: [
     "munName",
     "subMunName",
    "cityName",
     "districtName",
     "notes",
     "opticalDistortionType",
   "streetName",
    ],
    dashboardCharts:[
      {
        name:'MUNICIPALITY_NAME',
        alias:'deformationNuPermuniciplityName',
        chartType:'donut',
        position:'top',
        shownData:['count']
      },
 
      {
        name:'DEFORMATION_TYPE',
        alias:'deformationType',
        chartType:'pie',
        position:'bottom',
        shownData:['count']
      }
    ]
  },
  gis_eppms_section_vw: {
    name:"حالة الطرق",
    isHidden: true,
    isSearchable: true,
    outFields: [
      "OBJECTID",
      "AREA_NO",
      "AREA_NAME",
      "ROAD_NO",
      "CITY_NO",
      "ZONE_NO",
      "ROAD_NAME",
      "SECTION_NO",
      "SECTION_RATING",
      "MAINTENANCE_COST",
      "MAINTENANCE_PRIORITY",
      "SECTION_PCI",
      "DISTRESS_CONDITION_AFTER",
      "PREDICTED_DISTRESS_TYPE",
      "PREDICTED_PCI",
    ],
    aliasOutFields: [
      "districtNum",
     "districtName",
     "streetNum",
     "cityNum",
     "bandNum",
      "streetName",
      "sectionNum",
      "sectionevl",
     "CostOfMaintenance",
     "maintenancePriority",
     "pavementConditionIndicator",
     "damageTypeCode",
     "suggestedRepairType",
     "proposedPavementConditionIndicator",



    
    ],
    dashboardCharts:[]
  },
  transport_track: {
    isSearchable: true,
    name: "مسارات النقل",
    outFields: ["OBJECTID", "NAME"],
    aliasOutFields: ["pathName"],
    isHidden: true,
    dashboardCharts:[],
  },

  camera_locations: {
    name:"الكاميرات",
    outFields: ["OBJECTID", "LOCATION"],
    aliasOutFields: ["cameraLocation"],
    isHidden: true,
    dashboardCharts:[],
  },
  transport_stations: {
    name: "محطات النقل",
    outFields: [
      "OBJECTID",
      "MUN_NAME",
      "DISTRICT_NAME",
      "STATION_NO",
      "STREET_NAME",
      "STATION_AREA",
      "STATION_PATH",
    ],
    aliasOutFields: [
      "munName",
      "districtName",       
      "stationNum",
      "streetName",
      "stationArea",
      "path",
    ],
    isHidden: true,
    isSearchable: true,
    dashboardCharts:[],
  },

  Tarfeeh_Data: {
    name:  "ترفيه",
    outFields: [
      "OBJECTID",
      "MUNICIPALITY_NAME",
      "LOCATION_NAME",
      "EVENT_EXECUTIVE_NAME",
      "EVENT_NAME",
      "PROGRAM_TYPE",
      "PROGRAM_CATOGRIES",
      "EVENT_NO_DAY",
      "EVENT_FROM_DATE",
      "EVENT_TO_DATE",
      "SUGGESTED_LOCATION",
    ],
    aliasOutFields: [
      "munName",
      "locationName",
"TheExecutingAgency",
      "events",
      "natureOfProgram",
      "categoryOfProgram",
      "daysNum",
      "eventStartDate",
      "eventFinishDate",
      "sggestedPlace",
    ],
    isHidden: true,
    isSearchable: true,
    dashboardCharts:[
      {
        name:'MUNICIPALITY_NAME',
        alias:'eventsNoPermuniciplityName',
        chartType:'pie',
        position:'bottom',
        shownData:['count']
      },
 
      {
        name:'STATUS_OF_FUNDING',
        alias:'eventsStatusFund',
        chartType:'bar',
        position:'top',
        shownData:['count']
      },
      {
        name:'CONTRACT_STATUS',
        alias:'contractStatus',
        chartType:'col',
        position:'top',
        shownData:['count']
      }
    ],
  },
  digging_license: {
    name: "رخص الحفريات",
    isPublicSearchable: true,
    displayField: "CO_NAME_AR",
    isSearchable: true,
    isHidden: false,
    permission: function () {
      if (localStorage.user) {
        return localStorage.user.groups.find(function (x) {
          return x.id == 3031;
        });
      } else {
        return true;
      }
    },
    outFields: [
      "OBJECTID",
      "MUNICIPALITY_NAME",
      "SUB_MUNICIPALITY_NAME",
      "DISTRICT_NAME",
      "STREET_NAME",
      "BILLNU",
      "BILLCOAST",
      "START_LICENSE_DATE",
      "CR_NUMBER",
      "CO_NAME_AR",
      "EXPR1",
      "REQUEST_DATE",
      "TOTEXCLENGH",
      "PERIOD",
    ],
    aliasOutFields: [
      "munName",
      "subMunName",
      "districtName",
      "streetName" ,  
      "billNum",
      "billValue",
      "drillingliceStartDate",
      "contractorNum",
      "contractorName",
      "superAuthName",
      "orderDate",
      "drillingLength",
      "drillingTime",
    ],
    searchFields: [
      {
        field: "MUNICIPALITY_NAME",
        alias:       "munName",

        zoomLayer: {
          name: "Municipality_Boundary",
          filterField: "MUNICIPALITY_NAME",
        },
      },
      {
        field: "SUB_MUNICIPALITY_NAME",
        alias: "subMunName",
        zoomLayer: {
          name: "Sub_Municipality_Boundary",
          filterField: "SUB_MUNICIPALITY_NAME",
        },
      },
      {
        field: "DISTRICT_NAME",
        alias:  "districtName",
        zoomLayer: { name: "District_Boundary", filterField: "DISTRICT_NAME" },
      },
      { field: "CO_NAME_AR", alias: "contractorName" },
      { field: "EXPR1", alias: "superAuthName"},
      { field: "CREATED_DATE", alias: "from", isDate: true, operator: ">=" },
      {
        field: "CLOSED_DATE",
        alias: "to",
        isDate: true,
        operator: "<=",
        isEndDate: true,
      },
    ],
    dashboardCharts:[],
  },
  PavementSections: {
    name:"مضلعات الطرق - الأسفلت" ,
    isSearchable: true,
    isHidden: true,
    outFields: [
      "OBJECTID",
      "AREA_NAME",
      "AREA_NO",
      "SECTION_CO",
      "SECTION_ID",
      "ROADNO",
      "SECTIONID",
      "REMARKS",
      "SHAPE_LENG",
      "SECTION_NO",
      "SECTION_PC",
      "MAINTENANC",
      "MAINTENA_1",
      "DISTRESS_S",
      "DISTRESS_C",
      "DISTRESS_1",
      "SPECIAL_TR",
      "SPECIAL__1",
      "SPECIAL__2",
      "SECTION_RA",
      "RIDING_QUA",
      "SAFETY_CON",
      "DISTRESS_O",
      "CONSTRUCTI",
      "SURVEY_DAT",
      "ROAD_CLASS",
    ],
    aliasOutFields: [
      "areaName",
      "areaNum",
      "sectorsNum",
      "SectorIdNum",
      "roadNum",
      "SectorIdNum",
      "digramNotes",
      "Perimeter",
      "sectorNumer",
      "sectorAccounts",
      "maintenance",
      "maintenance1",
      "S_strait",
      "C_strait",
      "strait1",
      "specialTR",
      "special1",
      "special2",
      "sectorAR",
     "installQUA",
      "protectionNum",
      "O_strait",
      "dateCreated",
      "scanDate",
      "roadClassification",
    ],
    dashboardCharts:[],
  },

  Sidewalk: {
    isHidden: true,
    isSearchable: true,
    name:"أرصفة و جزر وسطية" ,
    outFields: [
      "OBJECTID",
      "AREA_NAME",
      "AREA_NO",
      "SECTION_CO",
      "SECTION_ID",
      "ROADNO",
      "SECTIONID",
      "REMARKS",
      "SHAPE_LENG",
      "SECTION_NO",
      "SECTION_PC",
      "MAINTENANC",
      "MAINTENA_1",
      "DISTRESS_S",
      "DISTRESS_C",
      "DISTRESS_1",
      "SPECIAL_TR",
      "SPECIAL__1",
      "SPECIAL__2",
      "SECTION_RA",
      "RIDING_QUA",
      "SAFETY_CON",
      "DISTRESS_O",
      "CONSTRUCTI",
      "SURVEY_DAT",
      "ROAD_CLASS",
    ],
    aliasOutFields: [
      "areaName",
      "areaNum",
      "sectorsNum",
      "SectorIdNum",
      "roadNum",
      "SectorIdNum",
      "digramNotes",
      "Perimeter",
      "sectorNumer",
      "sectorNumer",
      "sectorAccounts",
      "maintenance",
      "maintenance1",
      "S_strait",
      "C_strait",
      "strait1",
      "specialTR",
      "special1",
      "special2",
      "sectorAR",
     "installQUA",
      "protectionNum",
      "O_strait",
      "dateCreated",
      "scanDate",
      "roadClassification",
    ],
    dashboardCharts:[],
  },

  District_UrbanElements: {
    name: "أولويات التنمية - العناصر العمرانية علي مستوي الأحياء",
    isHidden: true,
    outFields: [
      "OBJECTID",
      "SUB_MUNICIPALITY_NAME",
      "DISTRICT_NAME",
      "REMARKS",
      "MUNICIPALITY_NAME",
      "POPULATION1437H",
      "BUILDING1437H",
      "PLANNED",
      "SPACE_UR",
      "CROPS",
      "RUGGED",
      "SERVICES",
      "INDUSTRY",
      "PARCEL_WA",
      "SPECIAL",
      "TOTAL_SPACE",
      "CURRENT_DENSITY",
      "DENSE_TYPE",
      "BUILDING_RATE",
      "STATE_BUILDINGS",
      "STATUS_PLANNING",
      "QUALITY_DEVE",
      "DIMENSION_CITY_CENTER",
      "TOPOGRAPHY",
      "URBAN_DEV_PRIO",
      "PRIM_CENTERNUM",
      "BENEF_NUM",
      "NOTIC",
      "PARCELBUILT_AREA",
      "PARCELBUILT_COVERED",
      "PARCELBUILT_NOTCOVERED",
      "PARCELPLAN_AREA",
      "PARCELPLAN_COVERED",
      "PARCELPLAN_NOTCOVERED",
      "PARCELSPACE_AREA",
      "PARCELSPACE_COVERED",
      "PARCELSPACE_NOTCOVERED",
      "PARCELBUILTR_AREA",
      "PARCELBUILTR_COVERED",
      "PARCELBUILTR_NOTCOVERED",
      "PARCELPLANR_AREA",
      "PARCELPLANR_COVERED",
      "PARCELPLANR_NOTCOVERED",
      "PARCELSPACER_AREA",
      "PARCELSPACER_COVERED",
      "PARCELSPACER_NOTCOVERED",
      "PARCELBUILTELEC_AREA",
      "PARCELBUILTELEC_COVERED",
      "PARCELBUILTELEC_NOTCOVERED",
      "PARCELPLANELEC_AREA",
      "PARCELPLANELEC_COVERED",
      "PARCELPLANELEC_NOTCOVERED",
      "PARCELSPACEELEC_AREA",
      "PARCELSPACEELEC_COVERED",
    ],
    aliasOutFields: [
      "whiteLndsUncElec",
      "elecresUse2015",
      "elecresUse2016",
      "buildUpLandArea",
      "buildUpLandCover",
      "buildUpLandNotCover",
      "planLandArea",
      "planLandCovered",
      "planLandUnCover",
      "whiteLandArea",
      "whiteLandCover",
      "whiteLandUnCover",
      "servNameGirlTutorial",
      "servLevelGirlEduc",
      "classNumGirls",
      "studentNumGirls",
      "buildOwnerShipGirls",
      "servNameTutorialBoys",
      "servLevelEducBoys",
      "classNumBoys",
      "studentsNumBoys",
      "buildOwnerShipBoys",

    ],
    dashboardCharts:[],
  },

  Building_Gov_Loc: {
    name: "مواقع صيانة المباني الحكومية",
    isSearchable: false,
    outFields: [
      "OBJECTID",
      "BUILD_NAME",
      "TYPE_BUILD",
      "TYPE_PRO",
      "OWNER_NAME",
      "No_Floors",
      "MUNICIPALITY_NAME",
    ],
    aliasOutFields: [
      "buildName",
      "buildType",
      "ownerShipType",
      "ownerName",
      "floorsNum",
      "munName",
    ],
    dashboardCharts:[],
  },

  CriticalSites: {
    name: "المواقع الحرجة -ادارة الكوارث",
    isSearchable: false,
    outFields: [
      "OBJECTID",
      "MUNICIPALITY_NAME",
      "DISTRICT_NAME",
      "STREET_NAME",
      "NAME_SUPER_AMANA",
      "MOBILE_NO",
      "CONTR_TEAM",
      "EQUIPMENT",
      "EMP_NO",
      "DESC_SITE",
    ],
    aliasOutFields: [
      "buildName",
      "Region",
      "street",
      "amanaSuperVName",
      "mobileNum",
      "constTeamSuper",
      "neccEquip",
      "laborNeedNum",
      "critSiteDesc",

   
    ],
    dashboardCharts:[],
  },

  Bridges_tunnels_Sites: {
    name: "مواقع الجسور والانفاق - الادارة العامة للاشراف",
    isSearchable: false,
    outFields: [
      "OBJECTID",
      "PROJECT_NAME",
      "COMP_RAT",
      "PRIM_DATENEW",
      "PRIM_DATE_MUN",
      "PRIM_DATE_EXC",
      "FINAL_DATENEW",
      "FINAL_DATE_MUN",
      "FINAL_DATE_EXC",
      "DEV_WEBSITE_DATE_MUN",
      "DEV_WEBSITE_DATE_EXC",
    ],
    aliasOutFields: [
      "projectName",
      "completeRate",
      "primaryHistory",
      "primaryHistryReform",
      "initExecDate",
      "constTeamSuper",
      "finalDate",
      "finalDateRepar",
      "execDeadline",
      "repairSiteDelDate",
      "SiteExecDate",
    ],
    dashboardCharts:[],
  },

  Tbl_SHOP_LIC_MATCHED: {
    isSearchable: false,
    name: "رخص المحلات",
    outFields: [
      "OBJECTID",
      "S_PLAN_NO1",
      "S_LAND_NO1",
      "S_SHOP_LIC_NO",
      "S_SHOP_YEAR",
      "SHOP_NAME",
      "PARCEL_SPATIAL_ID",
    ],
    aliasOutFields: [
      "planNum",
      "landNum",
      "storeLicenseNum",
      "storeLicenseDate",
      "storeName",
    ],
    dependecies: [
      {
        name: "Landbase_Parcel",
        icon: faSitemap,
        filter: "PLAN_SPATIAL_ID",
        filterDataType: "esriFieldTypeDouble",
        tooltip: "SurveyingPlotsData",
      },
    ],
    filter: "PARCEL_SPATIAL_ID",
    dashboardCharts:[],
  },

  Landbase_ParcelLic: {
    name: "رخص الأراضي",

    outFields: [
      "OBJECTID",
      "MUNICIPALITY_NAME",
      "SUB_MUNICIPALITY_NAME",
      "DISTRICT_NAME",
      "CITY_NAME",
      "LIC_NO",
      "LIC_YEAR",
      "PARCEL_PLAN_NO",
      "PLAN_NO",
    ],
    aliasOutFields: [
      "munName",
      "subMunName",
      "districtName",
      "cityName",
      "licenseNum",
      "licenseYear",
    "landNumONPlan",
      "planNum",
    ],
    dashboardCharts:[
      {
        name:'MUNICIPALITY_NAME',
        alias:'licenseNuPermuniciplityName',
        chartType:'donut',
        position:'top',
        shownData:['count']
      },
 {
      name:'ACTUAL_MAINLANDUSE',
      alias:"actualMainLUse",
      chartType:'donut',
      position:'top',
      shownData:['count']
    },{
      name:'PARCEL_INVESTED',
      alias:"parcelIsInvested",
      chartType:'col',
      position:'top',
      shownData:['count','area']
    },
    {
      name:'USING_SYMBOL',
      alias:"usingSymbol",
      chartType:'pie',
      position:'top',
      shownData:['count']
    },{
      name:'PARCEL_PROPERTY',
      alias:"parcelProperty",
      chartType:'bar',
      position:'top',
      shownData:['count']
    },
    {
      name:'PARCEL_DVELOPED',
      alias:'parcelIsDeveloped',
      chartType:'bar',
      position:'top',
      shownData:['count']
    },
    {
      name:'PARCEL_MAIN_LUSE',
      alias:"parcelMainLuse",
      chartType:'bar',
      position:'bottom',
      shownData:['count']
    }
    ],
  },
  Gas_StationsEP: {
    name:"محطات البنزين المنطقة الشرقية  للطرق الرئيسية",
    isSearchable: false,
    outFields: [
      "OBJECTID",
      "STATION_NAME",
      "AMANA",
      "GOV_NAME",
      "MUN_NAME",
      "CLASS_STATION",
      "ROAD_NAME",
      "ROAD_NO",
      "X_COORDINATE",
      "Y_COORDINATE",
      "CONS_BENZ95",
      "PUMPS_BENZ95",
      "CONS_BENZ91",
      "PUMPS_BENZ91",
      "DIESEL_CONS",
      "PUMPS_DIESEL",
      "CONS_KEROSENE",
      "PUMPS_KEROSENE",
    ],
    aliasOutFields: [
      "stationName",
      "amana",
      "govName",
      "munName",
      "stationClassification",
      "roadName",
      "roadNum",
      "northCoord",
      "eastCoord",
      "95Petrolconsumption",
      "95PetrolPumps",
      "91Petrolconsumption",
      "91PetrolPumps",
      "dieselConsumption",
      "dieselPumps",
      "keroseneConsumption",
      "kerosenePumps",

    ],
    dashboardCharts:[
      
      {
        name:'GOV_NAME',
        alias:'gasStationNoPerGovName',
        chartType:'donut',
        position:'top',
        shownData:['count']
      },
 
      {
        name:'MUN_NAME',
        alias:'gasStationNoPerMunName',
        chartType:'pie',
        position:'top',
        shownData:['count']
      },
      
      {
        name:'CLASS_STATION',
        alias:'stationClasses',
        chartType:'col',
        position:'bottom',
        shownData:['count']
      }
   
    ],
  },
  Gas_Stations_INT: {
    isSearchable: false,
    name:      "محطات بنزين داخل الحاضرة للطرق الرئيسية",
    isHidden: true,
    outFields: [
      "OBJECTID",
      "STATION_NAME",
      "AMANA",
      "GOV_NAME",
      "MUN_NAME",
      "CLASS_STATION",
      "ROAD_NAME",
      "ROAD_NO",
      "X_COORDINATE",
      "Y_COORDINATE",
      "CONS_BENZ95",
      "PUMPS_BENZ95",
      "CONS_BENZ91",
      "PUMPS_BENZ91",
      "DIESEL_CONS",
      "PUMPS_DIESEL",
      "CONS_KEROSENE",
      "PUMPS_KEROSENE",
    ],
    aliasOutFields: [
      "stationName",
      "amana",
      "govName",
      "munName",
      "stationClassification",
      "roadName",
      "roadNum",
      "northCoord",
      "eastCoord",
      "95Petrolconsumption",
      "95PetrolPumps",
      "91Petrolconsumption",
      "91PetrolPumps",
      "dieselConsumption",
      "dieselPumps",
      "keroseneConsumption",
      "kerosenePumps",
    ],
    dashboardCharts:[
      {
        name:'GOV_NAME',
        alias:'gasStationNoPerGovName',
        chartType:'donut',
        position:'top',
        shownData:['count']
      },
 
      {
        name:'MUN_NAME',
        alias:'gasStationNoPerMunName',
        chartType:'pie',
        position:'top',
        shownData:['count']
      },
      
      {
        name:'CLASS_STATION',
        alias:'stationClasses',
        chartType:'col',
        position:'bottom',
        shownData:['count']
      }
    ],
  },
  Gas_Stations_OutEP: {
    isSearchable: true,

    name:   "محطات بنزين خارج الحاضرة للطرق الرئيسية",
    isHidden: true,
    outFields: [
      "OBJECTID",
      "STATION_NAME",
      "AMANA",
      "GOV_NAME",
      "MUN_NAME",
      "CLASS_STATION",
      "ROAD_NAME",
      "ROAD_NO",
      "X_COORDINATE",
      "Y_COORDINATE",
      "CONS_BENZ95",
      "PUMPS_BENZ95",
      "CONS_BENZ91",
      "PUMPS_BENZ91",
      "DIESEL_CONS",
      "PUMPS_DIESEL",
      "CONS_KEROSENE",
      "PUMPS_KEROSENE",
    ],
    aliasOutFields: [
      "stationName",
      "amana",
      "govName",
      "munName",
      "stationClassification",

      "roadName",

      "roadNum",

      "northCoord",
      "eastCoord",
      "95Petrolconsumption",
      "95PetrolPumps",
      "91Petrolconsumption",
      "91PetrolPumps",
      "dieselConsumption",
      "dieselPumps",
      "keroseneConsumption",
      "kerosenePumps",
    ],
    dashboardCharts:[
      
      {
        name:'GOV_NAME',
        alias:'gasStationNoPerGovName',
        chartType:'donut',
        position:'top',
        shownData:['count']
      },
 
      {
        name:'MUN_NAME',
        alias:'gasStationNoPerMunName',
        chartType:'pie',
        position:'top',
        shownData:['count']
      },
      
      {
        name:'CLASS_STATION',
        alias:'stationClasses',
        chartType:'col',
        position:'bottom',
        shownData:['count']
      }
   
    ],
  },
  Gas_Stations_Satellites: {
    name: "محطات بنزين مضافة من جوجل المنطقة الشرقية للطرق الرئيسية",
    isSearchable: false,

    outFields: [
      "OBJECTID",
      "STATION_NAME",
      "AMANA",
      "GOV_NAME",
      "MUN_NAME",
      "CLASS_STATION",
      "ROAD_NAME",
      "ROAD_NO",
      "X_COORDINATE",
      "Y_COORDINATE",
      "CONS_BENZ95",
      "PUMPS_BENZ95",
      "CONS_BENZ91",
      "PUMPS_BENZ91",
      "DIESEL_CONS",
      "PUMPS_DIESEL",
      "CONS_KEROSENE",
      "PUMPS_KEROSENE",
    ],
    aliasOutFields: [
      "stationName",
      "amana",
      "govName",
      "munName",
           "stationClassification",

            "roadName",

            "roadNum",
            "northCoord",
            "eastCoord",
            "95Petrolconsumption",
            "95PetrolPumps",
            "91Petrolconsumption",
            "91PetrolPumps",
            "dieselConsumption",
            "dieselPumps",
            "keroseneConsumption",
            "kerosenePumps",
    ],
    dashboardCharts:[
      
      {
        name:'GOV_NAME',
        alias:'gasStationNoPerGovName',
        chartType:'donut',
        position:'top',
        shownData:['count']
      },
 
      {
        name:'MUN_NAME',
        alias:'gasStationNoPerMunName',
        chartType:'pie',
        position:'top',
        shownData:['count']
      },
      
      {
        name:'CLASS_STATION',
        alias:'stationClasses',
        chartType:'col',
        position:'bottom',
        shownData:['count']
      }
   
    ],
  },
  Province_Boundary: {
    name: "حدود الأمانة",
    isSearchable: true,
    outFields: ["OBJECTID", "PROVINCE_NAME", "PROVINCE_ENGNAME"],
    aliasOutFields: ["amanaName", "engAmanaName"],
    dashboardCharts:[],
  },
 

  PolesGisView: {
    name:       "أعمدة الإنارة",

    outFields: [
      "OBJECTID",
      "POLE_NO",
      "PANEL_NO",
      "CITY_NAME",
      "NEIGHBORHO",
      "STREET",
      "ADDRESS",
    ],
    aliasOutFields: [
      "lightPoleNum",
      "plateNum",
      "cityName",
      "districtName",
           "streetName",
           "address",
    ],
    dashboardCharts:[],
  },
  STATION_SITE: {
    name: "التعداد المروري",
    isSearchable: true,
    outFields: [
      "OBJECTID",
      "STATION_NO",
      "STREET_NAM",
      "CITY_SUBRE",
      "SUBMUNICIB",
    ],
    aliasOutFields: [
      "counterNum",
      "streetName",
      "cityName",
      "subMunName",
    ],
    dashboardCharts:[],
  },
  PanelsGisView: {
    isSearchable: true,
    name:       "لوحات الإنارة"    ,
    outFields: [
      "OBJECTID",
      "PANELNO",
      "CITY_NAME",
      "NEIGHBORHO",
      "STREET",
      "TRANSFORME",
      "CONTRACTOR",
      "POLES",
    ],
    aliasOutFields: [
      "plateNum",
      "cityName",
      "districtName",
      "streetName",
      "transformer",
      "contractorName",
      "ColumnNum",
    ],
    dashboardCharts:[],
  },
  Project_Data: {
    isSearchable: true,
    name: "بيانات المشاريع",
    outFields: [
      "OBJECTID",
      "PROJECT_NAME",
      "DEPARTMENT",
      "CONSULTANT",
      "CONTRACTOR",
      "STATUS",
      "CITY_NAME",
      "SUB_MUNICIPALITY_NAME",
    ],
    aliasOutFields: [
      "projectName",
      "Administration",
      "Consultant",
      "contractor",
      "projectStatus",
      "cityName",
      "subMunName",
    ],
    dashboardCharts:[],
  },
  AnnualFivYear_Plan: {
    isSearchable: true,
    name: "الخطة السنويه الخمسية",
    isUpdate: true,
    outFields: [
      "OBJECTID",
      "MAIN_SIDE_NAME",
      "PROJECT_NAME",
      "CONTRACT_NAME",
      "CONTRACT_START_DATE",
      "CONTRACT_END_DATE",
      "MUNICIPALITY_NAME",
      "NEIGHBORHOOD_NAME",
    ],
    aliasOutFields: [
"mainSideName",
      "projectName",
      "contractName",
      "suggStartDate",
      "suggFinishDate",
      "munName",
      "districtName",
    ],
    dashboardCharts:[],
  },

  Invest_Site_Polygon: {
    isSearchable: true,
    name: "الأراضي الإستثمارية",
    outFields: [
      "OBJECTID",
      "MUNICIPALITY_NAME",
      "DISTRICT_NAME",
      "PLAN_NO",
      "PARCEL_PLAN_NO",
      "STREET_NAME",
      "SITE_AREA",
      "SITE_ACTIVITY",
      "SITE_STATUS",
      "SITE_SUBTYPE",
      "CONTRACT_NUMBER",
      "PROJECT_NO",
      "SITE_LAT_COORD",
      "SITE_LONG_COORD",
      "USING_SYMBOL",
      "BLDG_CONDATIONS",
    ],
    aliasOutFields: [
      "munName",
      "districtName",
      "planNum",
      "landNumONPlan",
      "streetName",  
      "areaM2",  
      "propInvctivity",
      "locationstaus",
     "invSiteType",
     "contractNum",
     "bidNum",
     "latitudeEngCener",
     "longitudeEngCenter",
     "useCode",
     "buildConditionDesc",
    
    ],
    dashboardCharts:[
    
    
      {
        name:'SITE_STATUS',
        alias:'siteStatus',
        chartType:'bar',
        position:'top',
        shownData:['count']
      },
      {
        name:'SITE_SUBTYPE',
        alias:'siteSubtype',
        chartType:'line',
        position:'top',
        shownData:['count']
      },
      {
        name:'SITE_ACTIVITY',
        alias:'siteActivity',
        chartType:'pie',
        position:'bottom',
        shownData:['count']
      }
    ]
  },

  Municipality_Boundary: {
    isSearchable: true,
    order: 2,
    name: "حدود البلدية" ,
    outFields: [
      "OBJECTID",
      "PROVINCE_NAME",
      "MUNICIPALITY_NAME",
      "MUNICIPLAITY_TYPE",
    ],
    aliasOutFields: ["amanaName" ,"munName","munType"],
    chartInfo: { text: "", displayField: "MUNICIPALITY_NAME" },
    filter: "MUNICIPALITY_NAME",
    filerType: "subType",
    statistics: [
      {
        type: "count",
        field: "OBJECTID",
        name: "count",
      },
    ],
    //statistic: chartStaticsSettigns.landBaseParcel,
    dashboardCharts:[
      {
        name:'MUNICIPLAITY_TYPE',
        alias:"municiplityType",
        chartType:'bar',
        position:'top',
        shownData:['count']
      },
      {
        name:'MUN_CLASS',
        alias:"munClass",
        chartType:'pie',
        position:'bottom',
        shownData:['count']
      }
    ]
  },
  Sub_Municipality_Boundary: {
    isSearchable: true,
    order: 3,
    chartInfo: { text: "", displayField: "SUB_MUNICIPALITY_NAME" },
    name: "حدود البلديات الفرعية",
    outFields: ["OBJECTID", "MUNICIPALITY_NAME", "SUB_MUNICIPALITY_NAME"],
    filter: "SUB_MUNICIPALITY_NAME",
    filerType: "subType",
    aliasOutFields: ["munName",,  "subMunName"],
    //statistic: chartStaticsSettigns.landBaseParcel,
    dashboardCharts:[]
  },
  UrbanAreaBoundary: {
    isHiddenOnDashboard:true,
    isSeachable: true,
    order: 1,
    chartInfo: { text: "", displayField: "URBAN_BOUNDARY_TYPE" },
    name: "حدود النطاق العمراني",
    outFields: ["OBJECTID", "PROVINCE_NAME", "URBAN_BOUNDARY_TYPE"],
    aliasOutFields: ["amanaName", "UrbanScaleType"],
    dashboardCharts:[],
  },
  District_Boundary: {
    displayField: "DISTRICT_NAME",
    isPublicSearchable: true,
    order: 4,
    chartInfo: { text: "District", displayField: "DISTRICT_NAME" },
    isSearchable: true,
    name: "حدود الأحياء",
    outFields: ["OBJECTID", "MUNICIPALITY_NAME", "DISTRICT_NAME"],
    aliasOutFields: [      "munName",       "districtName"  ],
    filerType: "domain",
    filter: "DISTRICT_NAME",
    searchFields: [
      {
        field: "MUNICIPALITY_NAME",
        alias:       "munName"        ,
        zoomLayer: {
          name: "Municipality_Boundary",
          filterField: "MUNICIPALITY_NAME",
        },
      },
      {
        field: "DISTRICT_NAME",
        alias:  "districtName",
        zoomLayer: { name: "District_Boundary", filterField: "DISTRICT_NAME" },
      },
    ],
    statistics: [
      {
        type: "count",
        field: "OBJECTID",
        name: "count",
      },
    ],
    //statistic: chartStaticsSettigns.landBaseParcel,
    dashboardCharts:[]
     
  },
  Plan_Data: {
    isPublicSearchable: true,
    order: 5,
    displayField: "PLAN_NO",
    chartInfo: { text: "planNum", displayField: "PLAN_NO" },
    isSearchable: true,
    name: "حدود المخططات",
    outFields: [
      "OBJECTID",
      "MUNICIPALITY_NAME",
      "SUB_MUNICIPALITY_NAME",
      "PLAN_NO",
      "PLAN_NAME",
      "PLAN_SAK_NO",
      "PLAN_AREA",
      "PLAN_CLASS",
      "PLAN_TYPE",
      "PLAN_STATUS",
      "PLAN_SPATIAL_ID",
    ],
    statistics: [
      {
        type: "sum",
        field: "PLAN_AREA",
        name: "area",
      },
      {
        type: "count",
        field: "OBJECTID",
        name: "count",
      },
    ],
    searchFields: [
      {
        field: "MUNICIPALITY_NAME",
        alias:       "munName",

        zoomLayer: {
          name: "Municipality_Boundary",
          filterField: "MUNICIPALITY_NAME",
        },
      },
      {
        field: "PLAN_NO",
        alias:       "planNum",

        zoomLayer: { name: "Plan_Data", filterField: "PLAN_SPATIAL_ID" },
      },
    ],
    dependecies: [
      {
        name: "Landbase_Parcel",
        icon: faSitemap,
        filter: "PLAN_SPATIAL_ID",
        filterDataType: "esriFieldTypeDouble",
        tooltip: "SurveyingPlotsData",
      },
    ],
    filter: "PLAN_SPATIAL_ID",
    aliasOutFields: [
      "munName",
      "subMunName",           "planNum",

      "planName", 
      "titleDeedNum", 
      "planArea", 
      "planclassif", 
      "planType", 
      "planStatus", 

      
    ],
    area: [
      {
        type: "sum",
        field: "PLAN_AREA",
        name: "area",
      },
    ],
    //statistic: chartStaticsSettigns.landBaseParcel,
    dashboardCharts:[
      {
        name:'PLAN_CLASS',
        alias:'planClass',
        chartType:'polarArea',
        position:'top',
        shownData:['count']
      },
     
      {
        name:'PLAN_STATUS',
        alias:'planStatus',
        chartType:'donut',
        position:'top',
        shownData:['count']
      },
      {
        name:'PLAN_TYPE',
        alias:'planType',
        chartType:'pie',
        position:'top',
        shownData:['count']
      },
      {
        name:'APPROVAL_STATUS',
        alias:'approvalStatus',
        chartType:'bar',
        position:'top',
        shownData:['count']
      }, {
        name:'PLAN_LANDUSE',
        alias:'planLanduse',
        chartType:'line',
        position:'bottom',
        shownData:['count']
      }
    ]

  },
  Subdivision: {
    isHiddenOnDashboard:true,
    isSearchable: true,
    order: 6,
    chartInfo: { text: "", displayField: "SUBDIVISION_DESCRIPTION" },
    name:  "حدود التقسيم",
    outFields: [
      "OBJECTID",
      "MUNICIPALITY_NAME",
      "SUB_MUNICIPALITY_NAME",
      "SUBDIVISION_NO",
      "PLAN_NO",
      "SUBDIVISION_AREA",
      "SUBDIVISION_DESCRIPTION",
      "SUBDIVISION_TYPE",
      "SUBDIVISION_SPATIAL_ID",
    ],
    filter: "SUBDIVISION_SPATIAL_ID",
    aliasOutFields: [
      "munName",
      "subMunName",    
      "partitionNum",
      "planNum",

    

"partitionArea",
"partitionDesc",
"partitionType",

    ],
    area: [
      {
        type: "sum",
        field: "SUBDIVISION_AREA",
        name: "area",
      },
    ],
    //statistic: chartStaticsSettigns.landBaseParcel,
  },
  Landbase_Parcel: {
    isPublicSearchable: true,
    displayField: "PARCEL_PLAN_NO",
    order: 8,
    searchFields: [
      {
        field: "MUNICIPALITY_NAME",
        alias:       "munName",

        zoomLayer: {
          name: "Municipality_Boundary",
          filterField: "MUNICIPALITY_NAME",
        },
      },
      {
        field: "DISTRICT_NAME",
        alias:  "districtName",
        zoomLayer: { name: "District_Boundary", filterField: "DISTRICT_NAME" },
      },
      {
        field: "PLAN_NO",
        alias: "planNum",

        zoomLayer: { name: "Plan_Data", filterField: "PLAN_SPATIAL_ID" },
      },
      {
        field: "SUBDIVISION_TYPE",
        alias: "subdivisionType"
      },
      {
        field: "SUBDIVISION_DESCRIPTION",
        alias: "subdivisionDesc"
      },
      {
        field: "PARCEL_BLOCK_NO",
        alias: "blockNum",
        zoomLayer: { name: "Survey_Block", filterField: "BLOCK_SPATIAL_ID" },
      },
      { field: "PARCEL_PLAN_NO", alias:"landNum", isServerSideSearch: true },
    ],
    fromAnotherLayer: [
      {
        fieldName: "SUBDIVISION_TYPE",
        layerName: "Subdivision",
        outFields: ["SUBDIVISION_DESCRIPTION"],
      },
    ],
    statistics: [
      {
        type: "sum",
        field: "PARCEL_AREA",
        name: "area",
      },
      {
        type: "count",
        field: "OBJECTID",
        name: "count",
      },
    ],
    depenedFilter: [
      {
        fieldName: "DISTRICT_NAME",
        depenedField: "MUNICIPALITY_NAME",
        outFields: ["DISTRICT_NAME"],
        layer: "District_Boundary",
      },
      {
        fieldName: "DISTRICT_NAME",
        depenedField: "SUB_MUNICIPALITY_NAME",
        outFields: ["DISTRICT_NAME"],
        layer: "District_Boundary",
      },
      {
        fieldName: "SUB_MUNICIPALITY_NAME",
        depenedField: "MUNICIPALITY_NAME",
        outFields: ["SUB_MUNICIPALITY_NAME"],
        layer: "Sub_Municipality_Boundary",
      },
    ],

    isSearchable: true,
    name: "بيانات قطع الأراضي",
    outFields: [
      "OBJECTID",
      "MUNICIPALITY_NAME",
      "SUB_MUNICIPALITY_NAME",
      "PLAN_NO",
      "PARCEL_PLAN_NO",
      "DISTRICT_NAME",
      "PARCEL_AREA",
      "DETAILED_LANDUSE",
      "USING_SYMBOL",
      "PARCEL_BLOCK_NO",
      "SUBDIVISION_TYPE",
      "SUBDIVISION_DESCRIPTION",
      "PARCEL_MAIN_LUSE",
      "PARCEL_SUB_LUSE",
      "LANDMARK_NAME",
      "BLDG_CONDITIONS",
      "PARCEL_SPATIAL_ID",
      "LIC_NO",
      "LIC_YEAR",
      "REQ_TASK_TEXT",
      "UNITS_NUMBER",
      "OWNER_TYPE",
    ],
    dependecies: [
      {
        name: "Tbl_Parcel_Conditions",
        icon: faBuilding,
        filter: "USING_SYMBOL",
        filterDataType: "esriFieldTypeString",
        isTable: true,
        tooltip:"buildingReq",
        depName:"ParcelConditionsBtn"
      },
      {
        name: "TBL_Parcel_LIC",
        icon: faFilePdf,
        filter: "PARCEL_SPATIAL_ID",
        filterDataType: "esriFieldTypeDouble",
        isTable: true,
        tooltip: "buildLicenses",
        depName:'ParcelLicenseBtn'
      },
      {
        name: "Tbl_SHOP_LIC_MATCHED",
        icon: faCartPlus,
        filter: "PARCEL_SPATIAL_ID",
        filterDataType: "esriFieldTypeDouble",
        isTable: true,
        tooltip: "storeLicense",
        depName:'ShopLicenseBtn'
      },
      {
        name: "LGR_ROYAL",
        icon: faFileAlt,
        filter: "PARCEL_SPATIAL_ID",
        filterDataType: "esriFieldTypeDouble",
        isFromApi: true,
        tooltip: "propertyGrantData",
        // permission: function () {
        //   return localStorage.user.groups.find(function (x) {
        //     return x.id == 2528 || true;
        //   });
        // },
        showingField: "OWNER_TYPE",
        codeValue: 2,
        url: window.webApiUrl + "RoyalGrants?spId=",
        depName:'royalDataAttrTbl'
      },
      {
        name: "PARCEL_PRIVACY",
        icon: faUser,
        filter: "PARCEL_SPATIAL_ID",
        filterDataType: "esriFieldTypeDouble",
        isFromApi: true,
        tooltip: "landsAllotment",
        showingField: "OWNER_TYPE",
        codeValue: 1,
        // permission: function () {
        //   return localStorage.user.groups.find(function (x) {
        //     return x.id == 2689;
        //   });
        url: window.webApiUrl + "GetGovernmentLandsData?spId=",
        depName:'ownershipAttrTbl'
      },
      {
        name: "KROKY_SUBMISSIONS",
        icon: null,
        imgIconSrc:kroky,
        isFromApi: true,
        tooltip: "krokySubmission",
        showingField: "KROKY",
        url: window.webApiUrl + "submission/GetSubmissionsInfoByLandInfo/8",
        workflowUrl: window.workflowUrl +"survey_report/print_survay/",
        depName:'krokySubmissions'
      }, {
        name: "FARZ_SUBMISSIONS",
        icon: null,
        imgIconSrc:splitIcon,
        isFromApi: true,
        tooltip: "farzSubmission",
        showingField: "FARZ",
        url: window.webApiUrl + "submission/GetSubmissionsInfoByLandInfo/1",
        workflowUrl: window.workflowUrl + "split_merge/print_duplixs/",
        depName:'farzSubmissions'
      },
      {
        name: "CONTRACT_UPDATE_SUBMISSIONS",
        icon: null,
        imgIconSrc:updateContract,
        isFromApi: true,
        tooltip: "contractUpdateSubmission",
        showingField: "UPDATE_CONTRACT",
        url: window.webApiUrl + "submission/GetSubmissionsInfoByLandInfo/14",
        workflowUrl: window.workflowUrl + "contract_update/print_sak/",
        depName:'updateContractSubmissions',
        className:"contzwa2edClass"
      },
      {
        name: "ZAWAYED_SUBMISSIONS",
        icon: null,
        imgIconSrc:zwa2dTnzemya,
        isFromApi: true,
        tooltip: "zwa2edSubmission",
        showingField: "ZAWAYED",
        url: window.webApiUrl + "submission/GetSubmissionsInfoByLandInfo/22",
        workflowUrl: window.workflowUrl + "addedparcel_temp2/",
        depName:'zawayedSubmissions',
        className:"contzwa2edClass"
      },
      {
        name: "SERVICE_PROJECTS_SUBMISSIONS",
        icon: null,
        imgIconSrc:mshare3Icon,
        isFromApi: true,
        tooltip: "mshare3Submission",
        showingField: "SERVICE_PROJECTS",
        url: window.webApiUrl + "submission/GetSubmissionsInfoByLandInfo/19",
        workflowUrl: window.workflowUrl + "print_technical/",
        depName:'serviceProjectsSubmission',
        className:"contzwa2edClass"
      },
    ],
    filter: "PARCEL_SPATIAL_ID",
    aliasOutFields: [
      "munName",
      "subMunName",
      "planNum",

      "landNumONPlan",
      "districtName",
      "ApproxArea",
      "DetailedUse",
      "useCode",
      "blockNum",
      "partitionType",
"partitionDesc",
"mainUseOfLand",
"subUseOfLand",
"existBuildName",
      "buildConditionDesc",
      "licenseNum",
      "licenseDate",
      "currentStatus",
      "floorsNum",      //عدد الاوار
      "orderType",
      "buildType",
      "orderStatus",
      "regeqNum",
      "reaFromInstru",
      "letterNum",
      "speechHistory",
      "HijriDate",
      "indusUnitsNum",
      "houseUnitsNum",
      "servNum",
      "IdNum",
      "IdHistory",
      "idSource",
      "accuracyStatLevel",
      "storeName",
      "storeLicenseNum",
      "storeLicenseDate",
      "landicensNum",
      "unitsNum",
      "ownerShipType",
    ],
    area: [
      {
        type: "sum",
        field: "PARCEL_AREA",
        name: "area",
      },
    ],
    groupByFields: [
      "PARCEL_MAIN_LUSE",
      "PARCEL_SUB_LUSE",
      // "USING_SYMBOL","LANDUSE_SURVEY"
    ],
    //statistic: chartStaticsSettigns.landBaseParcel,
    dashboardCharts:[{
      name:'ACTUAL_MAINLANDUSE',
      alias:"actualMainLUse",
      chartType:'donut',
      position:'top',
      shownData:['count']
    },{
      name:'OWNER_TYPE',
      alias:"ownerType",
      chartType:'line',
      position:'top',
      shownData:['count','area']
    },
    {
      name:'USING_SYMBOL',
      alias:"usingSymbol",
      chartType:'pie',
      position:'top',
      shownData:['count']
    },{
      name:'PARCEL_MAIN_LUSE',
      alias:"parcelMainLuse",
      chartType:'bar',
      position:'bottom',
      shownData:['count']
    }]
  },

  LGR_ROYAL: {
    name: "بيانات المنح الملكية",
    outFields: [
      { id: 1, name: "citizen_name", alias: "citizenName" },
      { id: 2, name: "id_number", alias: "IdNum"},
      { id: 3, name: "card_no", alias:"cardNum" },
      { id: 4, name: "nor_ror_no", alias: "orderNum" },
      { id: 5, name: "nor_ror_no_cat", alias: "orderNum" },
      { id: 6, name: "ral_letter_no", alias: "NotLettNum" },
    ],
  },
  KROKY_SUBMISSIONS: {
    name: "معاملات الكروكي",
    outFields: [
      { id: 1, name: "id", alias: "id" },
      { id: 2, name: "request_no", alias: "request_no", isAnchor:true},
      { id: 3, name: "create_date", alias: "create_date" },
      ],
  },
  FARZ_SUBMISSIONS: {
    name: "معاملات الفرز",
    outFields: [
      { id: 1, name: "id", alias: "id" },
      { id: 2, name: "request_no", alias: "request_no", isAnchor:true},
      { id: 3, name: "export_date", alias: "export_date" },
      ],
  },
  CONTRACT_UPDATE_SUBMISSIONS: {
    name: "معاملات تحديث الصكوك",
    outFields: [
      { id: 1, name: "id", alias: "id" },
      { id: 2, name: "request_no", alias: "request_no", isAnchor:true},
      { id: 3, name: "export_date", alias: "export_date" },
      ],
  },
  ZAWAYED_SUBMISSIONS:{
    name: "معاملات الزوائد الخدمية",
    outFields: [
      { id: 1, name: "id", alias: "id" },
      { id: 2, name: "request_no", alias: "request_no", isAnchor:true},
      { id: 3, name: "create_date", alias: "create_date" },
      ],
  },
  SERVICE_PROJECTS_SUBMISSIONS:{
    name: "معاملات المشاريع الخدمية",
    outFields: [
      { id: 1, name: "id", alias: "id" },
      { id: 2, name: "request_no", alias: "request_no", isAnchor:true},
      { id: 3, name: "create_date", alias: "create_date" },
      ],
  },
  PARCEL_PRIVACY: {
    name: "أراضي التخصيص",
    outFields: [
      { id: 1, name: "request_no", alias:"reqNum"},
      { id: 2, name: "decision_no", alias:"decisionNum" },
      {
        id: 3,
        name: "decision_dateh",
        alias: "decisionDate" ,
        isDateFormat: true,
      },
      { id: 4, name: "activity", alias: "activityName" },
    ],
  },

  Serivces_Data: {
    isPublicSearchable: true,
    order: 8,
    displayField: "SRVC_NAME",
    isSearchable: true,
    searchFields: [
      {
        field: "MUNICIPALITY_NAME",
        alias:       "munName"
        ,
        zoomLayer: {
          name: "Municipality_Boundary",
          filterField: "MUNICIPALITY_NAME",
        },
      },
      { field: "SRVC_TYPE", alias: "servType"},
      { field: "SRVC_SUBTYPE", alias: "servsubUse"},
      { field: "SRVC_NAME", alias: "servName", isSearch: true },
    ],
    statistics: [
      {
        type: "count",
        field: "OBJECTID",
        name: "count",
      },
    ],
    depenedFilter: [
      {
        fieldName: "DISTRICT_NAME",
        depenedField: "MUNICIPALITY_NAME",
        outFields: ["DISTRICT_NAME"],
        layer: "District_Boundary",
      },
      {
        fieldName: "SUB_MUNICIPALITY_NAME",
        depenedField: "MUNICIPALITY_NAME",
        outFields: ["SUB_MUNICIPALITY_NAME"],
        layer: "Sub_Municipality_Boundary",
      },
    ],
    name: "بيانات الخدمة",
    outFields: [
      "OBJECTID",
      "MUNICIPALITY_NAME",
      "DISTRICT_NAME",
      "SUB_MUNICIPALITY_NAME",
      "CITY_NAME",
      "PLAN_NO",
      "SRVC_NAME",
      "SRVC_TYPE",
      "SRVC_DESCRIPTION",
      "SRVC_SUBTYPE",
      //"SRVC_OWNER_TYPE"
    ],
    aliasOutFields: [
      "munName",
      "districtName",
      "subMunName",
      "cityName",
      "planNum",
      "servName",


      "servType",
      "servDesc",
      "servsubUse",
    ,
      // "ملكية الخدمة"
    ],
    dashboardCharts:[
      {
        name:'SRVC_TYPE',
        alias:'serviceType',
        chartType:'donut',
        position:'top',
        shownData:['count']
      },
      {
        name:'SERVICE_DVELOPED',
        alias:'serviceIsDeveloped',
        chartType:'bar',
        position:'top',
        shownData:['count']
      },
      {
        name:'SRVC_OWNER_TYPE',
        alias:'serviceOwners',
        chartType:'line',
        position:'bottom',
        shownData:['count']
      }
    ],
  },

  Survey_Block: {
    isHiddenOnDashboard:true,
    isSearchable: true,
    order: 7,
    depenedFilter: [
      {
        fieldName: "DISTRICT_NAME",
        depenedField: "MUNICIPALITY_NAME",
        outFields: ["DISTRICT_NAME"],
        layer: "District_Boundary",
      },
      {
        fieldName: "SUB_MUNICIPALITY_NAME",
        depenedField: "MUNICIPALITY_NAME",
        outFields: ["SUB_MUNICIPALITY_NAME"],
        layer: "Sub_Municipality_Boundary",
      },
    ],
    chartInfo: { text: "blockNum", displayField: "BLOCK_NO" },
    name: "حدود البلوكات",
    outFields: [
      "OBJECTID",
      "MUNICIPALITY_NAME",
      "SUB_MUNICIPALITY_NAME",
      "BLOCK_NO",
      "PLAN_NO",
      "BLOCK_LUSE",
      "BLOCK_AREA",
      "DISTRICT_NAME",
      "CITY_NAME",
      "BLOCK_SPATIAL_ID",
    ],
    aliasOutFields: [
      "munName",
      "subMunName",
      "blockNum",
      "planNum",
      "blockUse",
      "blockArea",
      "districtName",
      "cityName"
    ],
    filter: "BLOCK_SPATIAL_ID",
    area: [
      {
        type: "sum",
        field: "BLOCK_AREA",
        name: "area",
      },
    ],
    //statistic: chartStaticsSettigns.landBaseParcel,
  },

  TBL_Parcel_LIC: {
    isSearchable: false,

    name:"رخص البناء",
    outFields: [
      "OBJECTID",
      "LIC_NO",
      "LIC_YEAR",
      "H_ISSUE_DATE",
      "NO_FLOORS",
      "REQ_TASK_TEXT",
      "ORD_TYPE",
      "BLD_TYPE",
      "RECORD_STATUS_TEXT",
      "REGION_USE_NO",
      "AREA_IN_ORD",
      "EL_LETTER_NO",
      "EL_LETTER_YEAR",
      "H_DATE",
      "REQ_TASK_TEXT",
      "NO_IND_UNITS",
      "NO_LIV_UNITS",
      "NO_SRV_UNITS",
      "OWNER_ID_NO",
      "OWNER_ID_DATE",
      "OWNER_ID_SOURCE",
      "RANK",
      "RANK_DESCRIPTION",
    ],
    isHidden: true,
    aliasOutFields: [
   "licenseNum",
   "liceYearIssuance",
   "liceDateIssuance",
      "floorsNum",//عدد الادوار
      "REQ_TASK_TEXT",
      "orderType",
      "buildType",
      "orderStatus",
      "regeqNum",
      "reaFromInstru",
      "letterNum",
      "speechHistory",
      "HijriDate",
      "currentStatus",
      "indusUnitsNum",
      "houseUnitsNum",
      "servNum",
      "IdNum",
      "IdHistory",
      "idSource",
      "accuracyStatLevel",
      "accuracyStat",
    ],
  },
  Parcel_Boundary: {
    name:"جدول أضلاع الأراضي",
    outFields: [
      "OBJECTID",
      "BOUNDARY_NO",
      "FROM_CORNER",
      "TO_CORNER",
      "BOUNDARY_LENGTH",
      "BOUNDARY_DIRECTION",
      "BOUNDARY_DESCRIPTION",
    ],
    isHidden: true,
    aliasOutFields: [
      "boundaryNum",
      "ribstartPoint",
      "ribfinishPoint",
      "boundaryLength",
      "Boundary_Direction",
      "boundaryDesc",
    ],
    dashboardCharts:[],
  },
  Parcel_Corner: {
    name: "جدول نقاط إحداثيات الأركان",
    outFields: [
      "OBJECTID",
      "CORNER_NO",
      "XUTM_COORD",
      "YUTM_COORD",
      "XGCS_COORD",
      "YGCS_COORD",
    ],
    isHidden: true,
    aliasOutFields: [
      "pointNumInLand",
      "xCoord",
      "yCoord",
      "longitudeCoord",
      "latitudeCoord",
    ],
    dashboardCharts:[],
  },

  Street_Naming: {
    order: 9,

    isPublicSearchable: true,
    isSearchable: true,
    depenedFilter: [
      {
        fieldName: "DISTRICT_NAME",
        depenedField: "MUNICIPALITY_NAME",
        outFields: ["DISTRICT_NAME"],
        layer: "District_Boundary",
      },
      {
        fieldName: "SUB_MUNICIPALITY_NAME",
        depenedField: "MUNICIPALITY_NAME",
        outFields: ["SUB_MUNICIPALITY_NAME"],
        layer: "Sub_Municipality_Boundary",
      },
    ],
    searchFields: [
      {
        field: "MUNICIPALITY_NAME",
        alias: "munName",
        zoomLayer: {
          name: "Municipality_Boundary",
          filterField: "MUNICIPALITY_NAME",
        },
      },
      { field: "STREET_FULLNAME", alias: "streetName", isSearch: true },
    ],
    displayField: "STREET_FULLNAME",
    name: "الشوارع",
    outFields: [
      "OBJECTID",
      "MUNICIPALITY_NAME",
      "SUB_MUNICIPALITY_NAME",
      "DISTRICT_NAME",
      "STREET_FULLNAME",
      "STREET_NAME_CLS",
      "STREET_CLASS",
      //"STREET_LENGTH",
      "WIDTH",
      //"STREET_TYPE",
      //"STREET_SPEED_CLASS",
      //"STREET_LIFECYCLE_STATUS",
    ],
    aliasOutFields: [
      "munName",
      "subMunName",
               "districtName",
      "streetName",
      "streetClassification",
      "streetType",
      "streetWidth",
      //"طول الطريق",
      //"عرض الطريق",
      //"نوع الشارع",
      //"سرعة الطريق",
      //"الحالة العمرية للطريق",
    ],
    dashboardCharts:[
     {
        name:'STREET_NAME_CLS',
        alias:"streetNameClass",
        chartType:'donut',
        position:'top',
        shownData:['count']
      },
      {
        name:'ONE_WAY',
        alias:"oneWay",
        chartType:'bar',
        position:'top',
        shownData:['count']
      },
      {
        name:'ASPHALT_STATUS',
        alias:"asphaltStatus",
        chartType:'line',
        position:'top',
        shownData:['count']
      }, {
        name:'STREET_CLASS',
        alias:"streetClass",
        chartType:'pie',
        position:'bottom',
        shownData:['count']
      }
    ]
  },

  Tbl_Parcel_Conditions: {
    name:  "اشتراطات البناء",

    outFields: [
      "OBJECTID",
      "SLIDE_AREA",
      "MIN_FROT_OFFSET",
      "DESCRIPTION",
      "BUILDING_RATIO",
      "FRONT_OFFSET",
      "SIDE_OFFSET",
      "BACK_OFFSET",
      "FLOORS",
      "FLOOR_HEIGHT",
      "ADD_FLOOR",
      "USING_SYMBOL",
      "FAR",
    ],
    isHidden: true,
    aliasOutFields: [
      "couponspace",
      "minFacade",
      "description",
      "buildRation",
      "faceBounce",
      "revAsspects",
      "backback",

      "floors",
      "floorHeight",
     "canaddFloor",
    "useCode",
    "buildBlockCoeff",
    ],
  },

  Admin_Mun_VoteDistrict: {
    isSearchable: true,

    isPublicSearchable: true,
    order: 1,
    name: "الدوائر الانتحابية" ,
    outFields: [
      "OBJECTID",
      "REMARKS",
      "VOTEDISTRICT_CODE",
      "VOTEDISTRICT_NAME_A",
    ],
    aliasOutFields: [
      "munName",
      "constituencyNum" ,
      "constituency" ,
    ],
    searchFields: [
      { field: "REMARKS", alias: "munName" },
      { field: "VOTEDISTRICT_CODE", alias: "constituencyNum" },
      {
        field: "VOTEDISTRICT_NAME_A",
        alias: "constituency",
        isSearch: true,
      },
    ],
    dashboardCharts:[],
  },
  GOV_boundary: {
    isHidden: true,
    isHiddenOnDashboard:true,
  },
  Eastern_Marsad: {
    isHidden: true,
    name: "المرصد الحضري",
    outFields: [
      "SECTOR",
      "SECTOR_TYBE",
      "SECTOR_SUBTYBE",
      "GOV_NAME",
      "INDICATOR_VALUE",
      "INDICATOR_NAME",
      "INDICATOR_SUBTYBE",
      "INDICATOR_DEFINATION",
      "INDICATOR_MEASURE",
      "RGB",
    ],
    aliasOutFields: [
      "sector",
      "sectorClassfication",
      "subSector",
      "govName",
      "inicatorValue",
      "indicatorName",
     "indicatorDetails",
     "indicatorIdentify",
     "indicatorMeasureUnit",

 
    ],
    searchFields: [
      { field: "SECTOR", alias: "sector"},
      { field: "SECTOR_TYBE", alias: "sectorClassfication"},
      { field: "SECTOR_SUBTYBE", alias: "subSector"},
      { field: "INDICATOR_NAME", alias: "indicatorName" },
      { field: "INDICATOR_SUBTYBE", alias: "indicatorClassfication" },
    ],
    isHiddenOnDashboard:true
  },
  Amana_buildings: {
    isSearchable: true,
    isPublicSearchable: true,
    order: 1,
    searchFields: [
      { field: "BUILDING_TYPE", alias: "buildType"},
      { field: "MATRIAL_TYPE", alias: "buildingMaterialType" },
      { field: "BUILDING_NAME", alias:"buildName", isSearch: true },
    ],
    name:"حصر مباني الأمانة" ,
    outFields: [
      "OBJECTID",
      "BUILDING_NAME",
      "OWNER_NAME",
      "FLOOR_NO",
      "PRICE",
      "BUILDING_TYPE",
      "MATRIAL_TYPE",
      "PRICE_STATUS",
    ],
    aliasOutFields: [
      "buildName",
      "ownerName",
  "floorsNum",
      "rentValue",
      "buildType",
  "buildingMaterialType",
      "buildStatus",
    ],
    dashboardCharts:[
      {
        name:'BUILDING_TYPE',
        alias:'buildingType',
        chartType:'pie',
        position:'bottom',
        shownData:['count']
      },
      {
        name:'PRICE_STATUS',
        alias:'priceStatus',
        chartType:'bar',
        position:'top',
        shownData:['count']
      },
      {
        name:'MATRIAL_TYPE',
        alias:'materialType',
        chartType:'line',
        position:'top',
        shownData:['count']
      }
    ],
  },
};
/*
export const publicUserlayersSetting = {
  // Deformation_Sites: {
  //     name:       "opticalDistortion",
  //     outFields: [
  //         "OBJECTID",
  //         "MUNICIPALITY_NAME",
  //         "SUB_MUNICIPALITY_NAME",
  //         "CITY_NAME",
  //         "DISTRICT_NAME",
  //         "REMARKS",
  //         "CREATED_USER",
  //         "CREATED_DATE",
  //         "LAST_EDITED_USER",
  //         "LAST_EDITED_DATE",
  //         "DEFORMATION_TYPE",
  //         "STREET_NAME",
  //         //"SHAPE"
  //     ]
  // },
  // gis_eppms_section_vw: {
  //     name: "حالة الطرق",
  //     outFields: [
  //         "OBJECTID",
  //         "AREA_NO",
  //         "AREA_NAME",
  //         "ROAD_NO",
  //         "CITY_NO",
  //         "ZONE_NO",
  //         "ROAD_NAME",
  //         "SECTION_NO",
  //         "SECTION_RATING",
  //         "MAINTENANCE_COST",
  //         "MAINTENANCE_PRIORITY",
  //         "SECTION_PCI",
  //         "DISTRESS_CONDITION_AFTER",
  //         "PREDICTED_DISTRESS_TYPE",
  //         "PREDICTED_PCI"
  //     ],
  //     aliasOutFields:[
  //         "رقم الحي",
  //          "districtName",
  //         "رقم الشارع",
  //         "رقم المدينة",
  //              "bandNum",
  //        "streetName",
  //               "sectionNum",

  //              "sectionevl",

  //         "تكلفة الصيانة",
  //         "أولوية الصيانة",
  //         "مؤشر حالة الرصف",
  //         "رمز نوع الضرر",
  //         "نوع الإصلاح المقترح",
  //         "مؤشر حالة الرصف المقترح",
  //     ],
  // },
  GOV_boundary: {
    isHidden: true,
  },
  Eastern_Marsad: {
    isHidden: true,
  },
  Admin_Mun_VoteLocation: {
    isHidden: true,
    isSearchable: true,
    displayField: "NAME",
    name: "المراكز الانتخابية",
    outFields: ["OBJECTID", "NAME", "VOTEDISTRICT_CODE", "TYPE"],
    aliasOutFields: ["الاسم", "رقم الدائرة الأنتخابية", "النوع"],
  },
  Admin_Mun_VoteDistrict: {
    isHidden: true,
    isSearchable: true,
    displayField: "VOTEDISTRICT_NAME_A",
    name: "الدوائر الانتخابية",
    outFields: ["OBJECTID", "VOTEDISTRICT_CODE", "VOTEDISTRICT_NAME_A"],
    aliasOutFields: ["رقم الدائرة الأنتخابية", "Voting District Name"],
  },

  Province_Boundary: {
    isHidden: true,

    displayField: "PROVINCE_NAME",
    name: "حدود الأمانة",
    outFields: ["OBJECTID", "PROVINCE_NAME", "PROVINCE_ENGNAME"],
    aliasOutFields: ["أسم الأمانة", "اسم الأمانة باللغة الانجليزية"],
  },
  Municipality_Boundary: {
    order: 2,
    name: "حدود البلدية",

    displayField: "MUNICIPALITY_NAME",
    outFields: [
      "OBJECTID",
      "PROVINCE_NAME",
      "MUNICIPALITY_NAME",
      "MUNICIPLAITY_TYPE",
    ],
    aliasOutFields: ["أسم الأمانة"      "munName",
, "نوع البلدية"],
    area: [
      {
        type: "sum",
        field: "SHAPE.AREA",
        name: "area",
      },
    ],
  },
  Sub_Municipality_Boundary: {
    order: 3,
    name: "حدود البلديات الفرعية",
    outFields: [
      "OBJECTID",
      "MUNICIPALITY_NAME",
      "SUB_MUNICIPALITY_NAME",
    ],
    aliasOutFields: [      "munName",
   "munName"],
  },
  UrbanAreaBoundary: {
    order: 1,
    displayField: "URBAN_BOUNDARY_TYPE",
    name: "حدود النطاق العمرانى",
    outFields: ["OBJECTID", "PROVINCE_NAME", "URBAN_BOUNDARY_TYPE"],
    aliasOutFields: ["اسم الأمانة", "نوع النطاق العمرانى"],
  },
  District_Boundary: {
    order: 4,
    isSearchable: true,
    name: "حدود الاحياء",
    displayField: "DISTRICT_NAME",
    outFields: ["OBJECTID", "MUNICIPALITY_NAME", "DISTRICT_NAME"],
    aliasOutFields: [      "munName",
     "munName"
],
  },
  Amana_buildings: {
    isSearchable: true,
    order: 1,
    isHidden: true,
    displayField: "BUILDING_NAME",
    name: "حصر لمبانى الأمانة",
    outFields: [
      "OBJECTID",
      "BUILDING_NAME",
      "OWNER_NAME",
      "FLOOR_NO",
      "PRICE",
      "BUILDING_TYPE",
      "MATRIAL_TYPE",
      "PRICE_STATUS",
    ],
    aliasOutFields: [
      "اسم المبنى ",
      "اسم المالك",
           "floorsNum",

      "قيمة الإيجار ",
      "نوع المبني",
      "نوع مادة البناء",
      "حالة المبنى",
    ],
  },

  Plan_Data: {
    order: 5,
    name: "بيانات المخططات",
    isSearchable: true,
    displayField: "PLAN_NO",
    searchFields: [
      { field: "MUNICIPALITY_NAME", alias: "munName", zoomLayer: { name: "Municipality_Boundary", filterField: "MUNICIPALITY_NAME" } },
      { field: "PLAN_NO", alias: "رقم المخطط", zoomLayer: { name: "Plan_Data", filterField: "PLAN_SPATIAL_ID" } },
    ],
    outFields: [
      "OBJECTID",
      "MUNICIPALITY_NAME",
      "PLAN_NO",
      "PLAN_SPATIAL_ID",
    ],
    dependecies: [
      {
        name: "Landbase_Parcel",
        icon: faSitemap,
        filter: "PLAN_SPATIAL_ID",
        tooltip: "بيانات قطع الأراضي المرفوعة مساحيًا"
      },
    ],
    filter: "PLAN_SPATIAL_ID",
    aliasOutFields: [ "munName", "رقم المخطط"],
    area: [
      {
        type: "sum",
        field: "PLAN_AREA",
        name: "area",
      },
    ],
  },
  Subdivision: {
    order: 6,
    name: "التقسيم",
    displayField: "SUBDIVISION_NO",
    outFields: [
      "OBJECTID",
      "MUNICIPALITY_NAME",
      "SUB_MUNICIPALITY_NAME",
      "SUBDIVISION_NO",
      "PLAN_NO",
      "SUBDIVISION_DESCRIPTION",
      "SUBDIVISION_TYPE",
      "SUBDIVISION_SPATIAL_ID",
    ],

    aliasOutFields: [
      "munName",
 "subMunName",      "رقم التقسيم",
        "planNum",

      "وصف التقسيم",
      "نوع التقسيم",
    ],
    area: [
      {
        type: "sum",
        field: "SUBDIVISION_AREA",
        name: "area",
      },
    ],
  },
  Satellite_Image_Boundary: {
    isHidden: true,
    name: "حدود تغطية صور الأقمار الصناعية",
    outFields: [
      "OBJECTID",
      "SATTELITE_IMAGE_DATE",
      "SATELLITE_IMAGE_SOURCE",
      "COVER_AREA",
    ],
    aliasOutFields: [
      "تاريخ صورة القمر الصناعي",
      "مصدر صورة القمر الصناعي",
      "مساحة نطاق التغطية - كم2",
    ],
  },
  Serivces_Data: {
    displayField: "SRVC_NAME",
    order: 8,
    isSearchable: true,
    
    searchFields: [
      { field: "MUNICIPALITY_NAME", alias: "munName", zoomLayer: { name: "Municipality_Boundary", filterField: "MUNICIPALITY_NAME" } },
      { field: "SRVC_TYPE", alias: "نوع الخدمة" },
      { field: "SRVC_SUBTYPE", alias: "الاستخدام الفرعى للخدمة"},
      { field: "SRVC_NAME ", alias: "اسم الخدمة", isSearch: true }
    ],
    name: "بيانات الخدمات",
    outFields: [
      "OBJECTID",
      "MUNICIPALITY_NAME",
      "DISTRICT_NAME",
      "SRVC_NAME",
      "SRVC_DESCRIPTION",
    ],
    aliasOutFields: [
      "munName",
      "اسم الحى",
      "اسم الخدمة",
      "وصف الخدمة",
    ],
  },
  LightPoles: {
    name: "اعمدة الإنارة",
    isHidden: true,

    outFields: [
      "OBJECTID",
      "CITY_NAME",
      "STREET_NAME",
      "POLE_INSTALLATIONDATE",
      "POLE_ENABLED",
      "POLE_LAMBS_COUNT",
      "POLE_MATERIAL_TYPE",
      "POLE_HEIGHT",
      "POLE_LAMPTYPE",
      "POLE_USAGE",
    ],
    aliasOutFields: [
      "اسم المدينة",
 "streetName",
      "تاريخ التركيب",
      "حالة عمود الإنارة",
      "عدد المصابيح",
      "مادة صنع العمود",
      "ارتفاع العمود",
      "نوع المصباح",
      "نوع خدمة العمود",
    ],
  },
  GCP_Data: {
    isHidden: true,
    name: "جدول بيانات نقاط الثوابت الأرضية",
    outFields: [
      "OBJECTID",
      "GCP_NO",
      "GCP_SOURCE",
      "GCP_ORDER",
      "GCP_STATUS",
      "X_COORDINATE",
      "Y_COORDINATE",
      "GCP_MATRIAL",
    ],
    aliasOutFields: [
      "رقم نقطة التحكم",
      "مصدر النقطة",
      "درجة النقطة",
      "حالة النقطة",
      "الاحداثيات الشرقية",
      "الاحداثيات الشمالية",
      "مادة صنع النقة",
    ],
  },
  Survey_Block: {
    displayField: "BLOCK_NO",
    order: 7,
    name: "بيانات البلوكات المرفوعة مساحياً",
    outFields: [
      "OBJECTID",
      "MUNICIPALITY_NAME",
      "SUB_MUNICIPALITY_NAME",
      "BLOCK_NO",
      "PLAN_NO",
      "BLOCK_LUSE",
      "DISTRICT_NAME",
      "CITY_NAME",
    ],
    aliasOutFields: [
      "munName",
 "subMunName",      "رقم البلوك",
         "planNum",

      "استخدام البلوك",
      "اسم الحى",
      "اسم المدينة",
    ],

    area: [
      {
        type: "sum",
        field: "BLOCK_AREA",
        name: "area",
      },
    ],
  },
  Block_Boundary: {
    name: "بيانات حدود البلوك",
    outFields: [
      "OBJECTID",
      "BOUNDARY_NO",
      "FROM_CORNER",
      "TO_CORNER",
      "BOUNDARY_LENGTH",
      "BOUNDARY_DESC",
      "BOUNDARY_DETAILS",
    ],
    aliasOutFields: [
      "رقم الحد",
      "رقم نقطة بداية الحد",
      "رقم نقطة نهاية الحد",
      "طول الحد - م",
      "وصف الحد",
      "وصف تفصيلى للحد",
    ],
  },
  Block_Corner: {
    isHidden: true,
    name: "نقاط اركان البلوك",
    outFields: [
      "OBJECTID",
      "CORNER_NO",
      "XUTM_COORD",
      "YUTM_COORD",
      "XGCS_COORD",
      "YGCS_COORD",
    ],
    aliasOutFields: [
      "رقم النقطة بالبلوك",
      "الإحداثي السينى",
      "الإحداثي الصادي",
      "إحداثي خط الطول",
      "إحداثي دائرة العرض",
    ],
  },
  Survey_Parcel: {
    isHidden: true,
    order: 8,
    isSearchable: false,
    name: "بيانات قطع الأراضى المرفوعة مساحياً",
    outFields: [
      "OBJECTID",
      "MUNICIPALITY_NAME",
      "PARCEL_PLAN_NO",
      "DISTRICT_NAME",
      "USING_SYMBOL",
      "BLDG_CONDITIONS",
      //"ACTUAL_MAINLANDUSE",
      //"LANDMARK_NAME",
      "PARCEL_SPATIAL_ID",
    ],
    dependecies: [
      {
        name: "Tbl_Parcel_Conditions",
        icon: "fa fa-building-o",
        isTable: true,
        filter: "USING_SYMBOL",
      },
    ],
    filter: "PARCEL_SPATIAL_ID",
    aliasOutFields: [
      "munName",
      "رقم قطعة الأرض بالمخطط",
      "اسم الحى",
      "رمز الاستخدام",
      //"وصف اشتراط البناء",
      //"اسم المعلم",
      "الاستخدام الفعلى لقطعة الارض",
    ],
    area: [
      {
        type: "sum",
        field: "PARCEL_AREA",
        name: "area",
      },
    ],
  },
  Tbl_SHOP_LIC_MATCHED: {
    name: "رخص المحلات",
    outFields: [
      "OBJECTID",

      "SHOP_NAME",
      "S_SHOP_LIC_NO",
      "S_SHOP_YEAR",
      "S_LIC_NO",
    ],
    isHidden: true,
    aliasOutFields: [
      "اسم المحل",
      "رقم رخصة المحل",
      "تاريخ رخصة المحل",
      "رقم رخصة الارض",
    ],
  },
  TBL_Parcel_LIC: {
    name: "رخص البناء",
    outFields: [
      "OBJECTID",
      "LIC_NO",
      "LIC_YEAR",
      "H_ISSUE_DATE",
      "NO_FLOORS",
      "REQ_TASK_TEXT",
      "ORD_TYPE",
      "BLD_TYPE",
      "RECORD_STATUS_TEXT",
      "REGION_USE_NO",
      "AREA_IN_ORD",
      "EL_LETTER_NO",
      "EL_LETTER_YEAR",
      "H_DATE",
      "REQ_TASK_TEXT",
      "NO_IND_UNITS",
      "NO_LIV_UNITS",
      "NO_SRV_UNITS",
      "OWNER_ID_NO",
      "OWNER_ID_DATE",
      "OWNER_ID_SOURCE",
      "RANK",
      "RANK_DESCRIPTION",
    ],
    isHidden: true,
    aliasOutFields: [
      "رقم الرخصة",
      "سنة إصدار الرخصة",
      "تاريخ اصدار الرخصة",
      "عدد الادوار",
      "REQ_TASK_TEXT",
      "نوع الطلب",
      "نوع المبنى",
      "حالة الطلب",
      "رقم اشتراط المنطقة",
      "المساحة من الصك",
      "رقم الخطاب",
      "تاريخ الخطاب",
      "التاريخ الهجرى",
      "حالة التيار",
      "عدد الوحدات الصناعية",
      "عدد الوحدات السكنية",
      "عدد الخدمات",
      "رقم الهوية",
      "تاريخ الهوية",
      "مصدر الهوية",
      "مستوى دقة البيان",
      "دقة البيان",
    ],
  },
  Landbase_Parcel: {

    displayField: "PARCEL_PLAN_NO",
    order: 8,
    isSearchable: true,
    name: "بيانات قطع الأراضى المرفوعة مساحياً",
    searchFields: [
      { field: "MUNICIPALITY_NAME", alias:       "munName",
 zoomLayer: { name: "Municipality_Boundary", filterField: "MUNICIPALITY_NAME" } },
      { field: "DISTRICT_NAME", alias:  "districtName", zoomLayer: { name: "District_Boundary", filterField: "DISTRICT_NAME" } },
      { field: "PLAN_NO", alias: "رقم المخطط", zoomLayer: { name: "Plan_Data", filterField: "PLAN_SPATIAL_ID" } },
      { field: "PARCEL_BLOCK_NO", alias: "رقم البلوك", zoomLayer: { name: "Survey_Block", filterField: "BLOCK_SPATIAL_ID" } },
      { field: "PARCEL_PLAN_NO", alias: "رقم الأرض", isSearch: true }
    ],
    outFields: [
      "OBJECTID",
      "MUNICIPALITY_NAME",
      "SUB_MUNICIPALITY_NAME",
      "PLAN_NO",
      "PARCEL_PLAN_NO",
      "DISTRICT_NAME",
      "USING_SYMBOL",
      "DETAILED_LANDUSE",
      "PARCEL_BLOCK_NO",
      "SUBDIVISION_TYPE",
      "PARCEL_MAIN_LUSE",
      "PARCEL_SUB_LUSE",
      "LANDMARK_NAME",
      "BLDG_CONDITIONS",
      "LIC_NO",
      "LIC_YEAR",
      "REQ_TASK_TEXT",
      "UNITS_NUMBER",
      "OWNER_TYPE",
      "PARCEL_SPATIAL_ID",
    ],
    dependecies: [
      {
        name: "Tbl_Parcel_Conditions",
        icon: faBuilding,
        filter: "USING_SYMBOL",
        isTable: true,
        tooltip: "اشتراطات البناء"
      },
      {
        name: "TBL_Parcel_LIC",
        icon: faFilePdf,
        filter: "PARCEL_SPATIAL_ID",
        isTable: true,
        tooltip: "رخص البناء"
      },
      {
        name: "Tbl_SHOP_LIC_MATCHED",
        icon: faCartPlus,
        filter: "PARCEL_SPATIAL_ID",
        isTable: true,
        tooltip:"رخص المحلات"
      },
    ],
    filter: "PARCEL_SPATIAL_ID",
    aliasOutFields: [
      "munName",
 "subMunName",      "رقم المخطط",
      "رقم قطعة الأرض بالمخطط",
      "اسم الحى",
      "رمز الاستخدام",
      "الاستخدام التفصيلى",
      "رقم البلك",
      "نوع التقسيم",
      "الأستخدام الرئيسي لقطعة الأرض",
      "الأستخدام الفرعي لقطعة الأرض",
      "اسم المبنى القائم",
      "وصف اشتراط البناء",
      "رقم الرخصه",
      "تاريخ الرخصه",
      "حالة التيار",
      "عدد الادوار",
      "نوع الطلب",
      "نوع المبنى",
      "حالة الطلب",
      "رقم اشتراط المنطقة",
      "المساحة من الصك",
      "رقم الخطاب",
      "تاريخ الخطاب",
      "التاريخ الهجرى",
      "عدد الوحدات الصناعية",
      "عدد الوحدات السكنية",
      "عدد الخدمات",
      "مستوى دقة البيان",
      "اسم المحل",
      "رقم رخصة المحل",
      "تاريخ رخصة المحل",
      "رقم رخصة الارض",
      "عدد الوحدات",
      "نوع الملكية",
    ],
    area: [
      {
        type: "sum",
        field: "PARCEL_AREA",
        name: "area",
      },
    ],
  },
  Parcel_Boundary: {
    name: "جدول أضلاع الأراضي",
    outFields: [
      "OBJECTID",
      "BOUNDARY_NO",
      "FROM_CORNER",
      "TO_CORNER",
      "BOUNDARY_LENGTH",
      "BOUNDARY_DIRECTION",
      "BOUNDARY_DESCRIPTION",
    ],
    isHidden: true,
    aliasOutFields: [
      "رقم الحد",
      "رقم نقطة بداية الضلع",
      "رقم نقطة نهاية الضلع",
      "طول الحد - م",
      "Boundary_Direction",
      "وصف الحد",
    ],
  },
  Parcel_Corner: {
    name: "جدول نقاط إحداثيات الأركان",
    outFields: [
      "OBJECTID",
      "CORNER_NO",
      "XUTM_COORD",
      "YUTM_COORD",
      "XGCS_COORD",
      "YGCS_COORD",
    ],
    isHidden: true,
    aliasOutFields: [
      "رقم النقطة بقطعة الارض",
      "الإحداثي السينى",
      "الإحداثي الصادي",
      "إحداثي خط الطول",
      "إحداثي خط العرض",
    ],
  },
  Building_Data: {
    isHidden: true,
    name: "بيانات المبانى",
    outFields: [
      "OBJECTID",
      "BLDG_NO",
      "MUNICIPALITY_NAME",
      "SUB_MUNICIPALITY_NAME",
      "DISTRICT_NAME",
      "STREET_NAME",
      "BLDG_NAME",
      "BLDG_ADDRESS",
      "BLDG_STATUS",
      "BLDG_HEIGHT",
      "BLDG_FLOOR_NO",
    ],
    aliasOutFields: [
      "رقم المبنى",
      "munName",
 "subMunName",      "اسم الحى",
     "streetName",
      "اسم المبني",
      "عنوان البيت",
      "حالة المبني",
      "ارتفاع المبنى",
      "عدد أدوار المبنى",
    ],
  },
  Violation_Data: {
    isHidden: true,
    name: "بيانات التعديات",
    outFields: [
      "OBJECTID",
      "MUNICIPALITY_NAME",
      "SUB_MUNICIPALITY_NAME",
      "VIOLATION_DESC",
    ],
    aliasOutFields: [
      "munName",
 "subMunName",      "وصف التعدي",
    ],
  },
  Street_Polygon: {
    isHidden: true,
    name: "عروض الشوارع",
    outFields: [
      "OBJECTID",
      "MUNICIPALITY_NAME",
      "SUB_MUNICIPALITY_NAME",
    ],
    aliasOutFields: [ "munName", "subMunName"],
  },
  Street_Naming: {
    displayField: "STREET_FULLNAME",
    isSearchable: true,
    searchFields: [
      { field: "MUNICIPALITY_NAME", alias:  "munName", zoomLayer: { name: "Municipality_Boundary", filterField: "MUNICIPALITY_NAME" } },
      { field: "STREET_FULLNAME", alias: "streetName", isSearch: true }
    ],
    name: "الشوارع",
    outFields: [
      "OBJECTID",
      "MUNICIPALITY_NAME",
      "DISTRICT_NAME",
      "STREET_FULLNAME",
      "WIDTH",
    ],
    aliasOutFields: [
      "munName",
      "اسم الحى",
    "streetName",
      "عرض الشارع",
    ],
  },
  Pavement: {
    isHidden: true,
    name: "أرصفة",
    outFields: [
      "OBJECTID",
      "MUNICIPALITY_NAME",
      "SUB_MUNICIPALITY_NAME",
    ],
    aliasOutFields: ["munName","subMunName"],
  },
  Street_Median: {
    isHidden: true,
    name: "جزر الشوارع",
    outFields: [
      "OBJECTID",
      "MUNICIPALITY_NAME",
      "SUB_MUNICIPALITY_NAME",
    ],
    aliasOutFields: ["munName","subMunName"],
  },
  Passageway: {
    isHidden: true,
    name: "ممر مشاة",
    outFields: [
      "OBJECTID",
      "MUNICIPALITY_NAME",
      "SUB_MUNICIPALITY_NAME",
    ],
    aliasOutFields: [ "munName", "subMunName"],
  },
  Proposed_Survey_Parcel: {
    name: "الاراضى المقترحة",
    outFields: ["*"],
    isHidden: true,
    aliasOutFields: [],
    area: [
      {
        type: "sum",
        field: "PARCEL_AREA ",
        name: "area",
      },
    ],
  },
  Tbl_Parcel_Conditions: {
    name: "اشتراطات البناء",
    outFields: [
      "OBJECTID",
      "MIN_FROT_OFFSET",
      "DESCRIPTION",
      "BUILDING_RATIO",
      "FRONT_OFFSET",
      "SIDE_OFFSET",
      "BACK_OFFSET",
      "FLOORS",
      "FLOOR_HEIGHT",
      "ADD_FLOOR",
      "USING_SYMBOL",
      "FAR",
    ],
    isHidden: true,
    aliasOutFields: [
      "الحد الأدنى للواجهة",
      "الوصف",
      "نسبة_البناء",
      "إرتداد الواجهة",
      "ارتداد الجوانب",
      "الارتداد الخلفي",
      "طوابق",
      "ارتفاع_الطابق",
      "يمكن اضافة دور",
      "رمز الاستعمال",
      "معامل_كتلة_البناء",
    ],
  },
  Survey_Parcel_H: {
    outFields: [
      "OBJECTID",
      "MUNICIPALITY_NAME",
      "SUB_MUNICIPALITY_NAME",
      "DISTRICT_NAME",
      "PLAN_NO",
      "PARCEL_PLAN_NO",
      "ARCHIVE_TIME",
      "OPERATION_TYPE",
      "USER_NAME",
    ],
    isHidden: true,
    aliasOutFields: [
      "munName",
"subMunName",      "اسم الحى",
      "رقم المخطط",
      "رقم قطعة الأرض بالمخطط",
      "تاريخ الارشيف",
      "نوع العملية",
      "اسم المستخدم",
    ],
    area: [
      {
        type: "sum",
        field: "PARCEL_AREA",
        name: "area",
      },
    ],
  },
};*/

export const layersSetting =
  /*localStorage.user ? */ loginLayersSetting; /* : publicUserlayersSetting*/

//for any new added layer on map service
export const TempobjectLayer = {
  searchFields: [
    {
      field: "MUNICIPALITY_NAME",
      alias: "munName",
      zoomLayer: {
        name: "Municipality_Boundary",
        filterField: "MUNICIPALITY_NAME",
      },
    },
    {
      field: "SUB_MUNICIPALITY_NAME",
      alias: "subMunName",
      zoomLayer: {
        name: "Sub_Municipality_Boundary",
        filterField: "SUB_MUNICIPALITY_NAME",
      },
    },
    {
      field: "DISTRICT_NAME",
      alias: "districtName",
      zoomLayer: { name: "District_Boundary", filterField: "DISTRICT_NAME" },
    },
  ],
  isPublicSearchable: true,
};
