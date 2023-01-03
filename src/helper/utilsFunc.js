import { notification } from "antd"
export const notificationMessage = (message, duration=3,placement="topLeft") => {
    const args = {
      description: message,
      duration: duration,
      placement:placement,
    };
    notification.open(args);
  };

  export const convertNumbersToEnglish = (numberInArabic) => {
    let numberInStr = numberInArabic?.toString()||"";
    return numberInStr
      .replace(/[\u0660-\u0669]/g, (c) => {
        return c.charCodeAt(0) - 0x0660;
      })
      .replace(/[\u06f0-\u06f9]/g, (c) => {
        return c.charCodeAt(0) - 0x06f0;
      });
  };
  
  export const convertEngNumbersToArabic = (digit) => {
    let digitInStr = digit?.toString()||"";
    return digitInStr.replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[d]);
  };

  export const getUniqeID =()=>{
    const head = Date.now().toString(36);
    const tail = Math.random().toString(36).substr(2);
    return head+tail
}

export const isNumber =(data)=>{
  let isNumber = Number(convertNumbersToEnglish(data));
  if(isNumber) return true;
  else return false
}

export default function generateRandomColor(){
  let newColor;
  do{
  newColor = "#"+(Math.random()*0xFFFFFF<<0).toString(16);

}while(newColor.length<7){
return newColor;
}
}

//r,g,b belongs to the dark color that need its granduted colors from dark to light 
export const generateGraduatedColor =(r,g,b,nuRange)=>{
  
  let colors=[];
  let rangeNumber = nuRange||30;
  let rOriginal = r, gOriginal = g, bOriginal=b;
  for(let i=0;i<rangeNumber;i++)
  {
    if(r+10>255 || g+10>255 || b+10>255){
      r=rOriginal+6;
      g=gOriginal+6;
      b=bOriginal+6;
    }else {
      r+=10;
      g+=10;
      b+=10;
    }
    colors.push(`rgb(${r},${g},${b})`);
  }
return colors
}

export const showDataSplittedBySlash = (txt) => {
    if (localStorage.getItem("lang") == 'ar') {
      if (txt) {
        if ((txt + '').indexOf('/') > -1) {
          let splitCount = (txt + '').split('/');
          if (splitCount.length > 1 && splitCount.every(item=>isNumber(item))) {
            return txt && (txt + '').split('/')?.reverse()?.join('/')
          }
        }
        else if ((txt + '').indexOf('-') > -1) {
          let splitCount = (txt + '').split('-');
          if (splitCount.length > 1 && splitCount.every(item=>isNumber(item))) {
            return txt && (txt + '').split('-')?.reverse()?.join('-')
          }
        }
      }

    }
    return txt;
  }

 export const getNoDaysPerMonth = (monthOrder)=>{
  let monthsOrderWith31 = [1,3,5,7,8,10,12];
  let monthsOrderWith28 = [2];
  if(monthsOrderWith31.includes(monthOrder)) return 31;
  else if(monthsOrderWith28.includes(monthOrder)) return 28;
  else return 30
  }

  export function getMinMax(arr){
       
      let n = arr.length
      let mx,mn,i
       
      // If array has even number of elements then
      // initialize the first two elements as minimum
      // and maximum
      if(n % 2 == 0){
          mx = Math.max(arr[0], arr[1])
          mn = Math.min(arr[0], arr[1])
           
          // set the starting index for loop
          i = 2
      }
           
      // If array has odd number of elements then
      // initialize the first element as minimum
      // and maximum
      else{
          mx = mn = arr[0]
           
          // set the starting index for loop
          i = 1
      }
           
      // In the while loop, pick elements in pair and
      // compare the pair with max and min so far
      while(i < n - 1){
          if(arr[i] < arr[i + 1]){
              mx = Math.max(mx, arr[i + 1])
              mn = Math.min(mn, arr[i])
          }
          else{
              mx = Math.max(mx, arr[i])
              mn = Math.min(mn, arr[i + 1])
          }
               
          // Increment the index by 2 as two
          // elements are processed in loop
          i += 2
      }
       
      return {max:mx, min:mn}
  }

  export function getSum(arr){
    let total = 0;
    for (let index = 0; index < arr.length; index++) {
      const element = parseFloat(arr[index]);
      total+=element;
    }
    return total
  }