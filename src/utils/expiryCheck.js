const expiryCheck=async (theatre,day)=>{
      const recent=new Date.now;
      const expiry=theatre.leaseInfo.lastDate
      if(day.getTime()<recent.getTime() || day.getTime()>expiry.getTime())
      {
        return false;
      }
      return true;
}
module.exports=expiryCheck