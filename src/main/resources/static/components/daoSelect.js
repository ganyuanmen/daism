class DaoSelect {
   // static daos = [];
    static is_connect=false;

    constructor() {
        this.selectobj=undefined;
        this.viewDiv=undefined;
    }
   // static getAttr(id,pname)
   //  {
   //      let re='';
   //      for(let i=0;i<DaoSelect.daos.length;i++)
   //      {
   //          if(DaoSelect.daos[i].id==id)
   //          {
   //              re=DaoSelect.daos[i][pname];
   //              break;
   //          }
   //      }
   //      return re;
   //  }
   //  async get_daos() {
   //      let daopromise = new Promise(function(resolve, reject) {
   //          daoInfo_obj.getInfo().then((result) => {
   //              if (result && result.length) {
   //                  let dao=[];
   //                  result.forEach(function (v) {
   //                     dao.push({id: v['id'], name: v['daoInfo'][0], logo: v['daoInfo']['logo'],isSet:false,os:v['daoInfo']['os'],token:'0'})
   //                  });
   //                 dao.forEach(function (v){
   //                      logos_obj.getLogo(v.id).then(re=>{
   //                          if(re) { v['logo']=re;v['isSet']=true;}
   //                      });
   //                     ERC20s_obj.getIsIssue([v.id]).then(function (re){
   //                         v['token']=re[0];
   //                     });
   //                  });
   //                  resolve(dao)
   //              }
   //          })
   //      });
   //      return daopromise;
   //  }
   //
  //
  // static  gene_option(pselect,viewDiv) {
  //     pselect.empty();
  //     if (DaoSelect.daos.length) {
  //         viewDiv.html(DaoSelect.daos[0]['logo']);
  //         DaoSelect.daos.forEach(function (v) {
  //             $('<option value="' + v.id + '">' + v.name + '</option>').appendTo(pselect);
  //         })
  //     }
  // }

  show1(daoId)
  {
      for(let i=0;i<daoManagerWindow.dataAll.length;i++)
      {
          if(daoManagerWindow.dataAll[i]["daoId"]==daoId)
          {
              this.selectobj
                  .data('osaddress',daoManagerWindow.dataAll[i]["osAddress"])
                  .data('tokenid',daoManagerWindow.dataAll[i]["tokenId"])
                  .data('logodaoId',daoManagerWindow.dataAll[i]["logodaoId"])
                  .data('daoname',daoManagerWindow.dataAll[i]["daoName"])
                  .empty()
                  .append('<option value="'+daoId+'" >'+daoManagerWindow.dataAll[i]['daoName']+'('+daoManagerWindow.dataAll[i]['daoSymbol']+')</option>');
              this.viewDiv.empty();
              $('<img>').height(32).width(32).attr('src','data:image/svg+xml;base64,' + window.btoa(daoManagerWindow.dataAll[i]['daoLogo'])).appendTo(this.viewDiv);
              break;
          }
      }

  }
    init(parentDiv,viewDiv) {
        let _this = this;
        this.viewDiv = viewDiv;
        // this.selectobj=$('<select required class="form-select form-control" ></select>').on('change', function () {
        //     _this.viewDiv.html(DaoSelect.getAttr($(this).val(),'logo'))
        // }).appendTo(parentDiv);
        this.selectobj = $('<select required class="form-select form-control" ></select>').appendTo(parentDiv);
        $('<button class="input-group-text btn btn-primary ">选择DAO</button>').on('click', function (e) {
            if (DaoSelect.is_connect) {
                if (daoManagerWindow === undefined) {
                    daoManagerWindow = new daoSelectWindow({id: 0, managerAddress: selectedAccount});
                    daoManagerWindow.setFn(function (daoId) {
                        _this.show1(daoId);
                    })
                } else {
                    daoManagerWindow.setFn(function (daoId) {
                        _this.show1(daoId);
                    })
                    daoManagerWindow.model.show();
                }
            } else {
                makeBack('没有连接钱包，无法操作！', true, true);
            }
            e.preventDefault()
            e.stopPropagation()
        }).appendTo(parentDiv);
    }
}
