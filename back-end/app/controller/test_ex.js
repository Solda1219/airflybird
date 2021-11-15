const test = async()=>{
    const normal_data = [
      {
        lat:38.958367,
        lng:121.542051,
      },
      {
        lat:38.958367,
        lng:121.54202,
      },
      {
        lat:38.958327,
        lng:121.5423051,
      },
      {
        lat:38.958367,
        lng:121.542051,
      },
      {
        lat:38.953367,
        lng:121.542051,
      }
    ]
    const err_data = [
      {
        lat:'38---9583,67',
        lng:121.542051,
      },
      {
        lat:38.958367,
        lng:121.54202,
      },
      {
        lat:38.958327,
        lng:121.5423051,
      },
      {
        lat:38.958367,
        lng:121.542051,
      },
      {
        lat:38.953367,
        lng:121.542051,
      }
    ]
    const null_data = [
      {
        lat:null,
        lng:121.542051,
      },
      {
        lat:38.958367,
        lng:121.54202,
      },
      {
        lat:38.958327,
        lng:121.5423051,
      },
      {
        lat:0,
        lng:121.542051,
      },
      {
        lat:38.953367,
        lng:'',
      }
    ]
  }