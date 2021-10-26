class CreateDao {
    clickMenu(menuItem,divIndex){
        if(this.currentMenu) this.currentMenu.removeClass('bg-info');
        $(menuItem).addClass('bg-info');
        this.currentMenu=$(menuItem);
        if(this.currentDiv) this.currentDiv.hide();
        this.div[divIndex].show();
        this.currentDiv=this.div[divIndex];
    }
   render(pid) {
       let _this=this;
       let _p = $('#' + pid);
       let _menu = $('<div class="shadow-sm p-3 mb-5 bg-body rounded hmenu noselect" ></div>').appendTo(_p);
       $('<div><i class="bi bi-file-earmark-plus"></i><br/>注册</div>').addClass('hitem').on('click',function (){
           clickMenu(this,0)
       }).appendTo(_menu);
       $('<div><i class="bi bi-file-earmark-image"></i><br/>更新logo</div>').addClass('hitem').on('click',function (){
           clickMenu(this,1)
       }).appendTo(_menu);
       $('<div><i class="bi bi-file-earmark-plus"></i><br/>创建OS</div>').addClass('hitem').on('click',function (){
           clickMenu(this,2)
       }).appendTo(_menu);
       $('<div><i class="bi bi-currency-dollar"></i><br/>发行token</div>').addClass('hitem').on('click',function (){
           clickMenu(this,3)
       }).appendTo(_menu);

       this.div[0]=$('<form class="row g-2 needs-validation" novalidate ></form>').on('submit',function (e){
           if ($(this)[0].checkValidity()) {
               makeBack('<div style="text-align: center" ><img src="/lodding.gif" /></div>',false,false);
               let _id=daoLogo.selectobj.val();
               let _is=DaoSelect.getAttr(_id,'isSet');
               if(!_is)
                   logos_obj.setLogo(_id, $('#selectDaoLogo').html(),callbackFn)
               else
                   logos_obj.changeLogo(_id, $('#selectDaoLogo').html(),callbackFn());
           }
           $(this).addClass('was-validated')
           e.preventDefault()
           e.stopPropagation()
       }).appendTo(_p);




   }

    constructor(paras) {
        this.div=[undefined,undefined,undefined,undefined];
        this.currentDiv = undefined;
        this.currentMenu=undefined;


    }
}
