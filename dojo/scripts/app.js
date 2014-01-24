document.addEventListener('deviceready', function () {
    navigator.splashscreen.hide();
}, false);

var idcheck=0,query,item;
var ds_employe,ds_detailemploye;
ds_employe = new kendo.data.DataSource({
    batch:false,
    endlessScroll:true,
    transport: {
        read: {
            	url:"http://localhost/TresorGrh/grh/www/index.php?module=employemanager&action=mobile:read",
           	    dataType: "jsonp"
        },
        create: {
                     url:"http://localhost/TresorGrh/grh/www/index.php?module=employemanager&action=mobile:create",
                     dataType: "jsonp",
                     type:"POST"
        },
        destroy: {
                     url:"http://localhost/TresorGrh/grh/www/index.php?module=employemanager&action=mobile:delete",
                     dataType: "jsonp"
                 }
        },
       schema:{
           total:"count",
           model:{
               id:"EmployeID",
               fields:{
                   FirstName:{type:"string"},
                   LastName:{type:"string"},
                   Title:{type:"string"},
                   Address:{type:"string"},
                   City:{type:"string"},
                   Country:{type:"string"},
                   PostalCode:{type:"string"}
               }
           }
       }
}); 



function showEmployeeDetails(e){
     view = e.view;
   query = parseInt(view.params.Id.toString());
  var detailtemp = kendo.template($("#employeedetaitemplate").text());
  ds_detailemploye = new kendo.data.DataSource({
        batch:false,
        endlessScroll:true,
        transport: {
            read: {
                    url:"http://localhost/TresorGrh/grh/www/index.php?module=employemanager&action=mobile:display",
                    dataType: "jsonp",
                    data: { 
                            q : query   
                        }
             }
        }
    }); 

    ds_detailemploye.fetch(function(){
        item =  ds_detailemploye.at(0);
        view.scrollerContent.html(detailtemp(item));
        kendo.mobile.init(view.content);
    });
    
}

function savedata(e){
      if($("#firstname").val()!="" && $("#lastname").val()!=""){
           var data = getFormData();
            ds_employe.add(data);
            ds_employe.sync();
            resetForm();
            $("#operation-state").html("Sucessfully Inserted");
       }else{
           navigator.notification.alert(
            'Please Fill all form!',         
            'Dojo App'              
          );
       }
   }

function resetForm(){
            $("#firstname").val('');
            $("#lastname").val(''),
            $("#title").val(''),
            $("#address").val(''),
            $("#city").val(''),
            $("#country").val(''),
            $("#postalcode").val('')
}

function getFormData(){
  var data = {
          FirstName:$("#firstname").val(),
          LastName:$("#lastname").val(),
          Title:$("#title").val(),
          Address: $("#address").val(),
          City:$("#city").val(),
          Country:$("#country").val(),
          PostalCode:$("#postalcode").val()
          };
   return data;
}


function onConfirm(buttonIndex) {
    if(parseInt(buttonIndex)==1){
      idcheck=1;
    }
}

function showConfirm() {
    navigator.notification.confirm(
        'Do you want to delete!',
         onConfirm,
        'Dojo App',           
        ['Ok','Cancel']         
    );
}

function deleteDate(id){
     showConfirm();
     if(idcheck==1){
        $.ajax({ 
               url:'http://localhost/TresorGrh/grh/www/index.php?module=employemanager&action=mobile:delete',
               dataType: 'jsonp',
               data: {Id:id},
               success:function(d){
                 ds_employe.read();
                 app.navigate('#employeehomeview');
               }
             });
     }
     idcheck=0;
}


function showEditForm(id){
  app.navigate('#employeeeditview');
}

function getEditFormData(){
  var data = {
          Id:$("#editid").val(),
          FirstName:$("#editfirstname").val(),
          LastName:$("#editlastname").val(),
          Title:$("#edittitle").val(),
          Address: $("#editaddress").val(),
          City:$("#editcity").val(),
          Country:$("#editcountry").val(),
          PostalCode:$("#editpostalcode").val()
          };
   return data;
}

function updateData(){
    var editdata = getEditFormData();
      $.ajax({ 
              url:'http://localhost/TresorGrh/grh/www/index.php?module=employemanager&action=mobile:update',
              dataType: 'jsonp',
              data:editdata,
              success:function(d){
                      resetEditForm();
                      ds_employe.read();
                      app.navigate('#employeehomeview');
                    }
              });
}

function resetEditForm(){
    $("#editfirstname").val('');
    $("#editlastname").val(''),
    $("#edittitle").val(''),
    $("#editaddress").val(''),
    $("#editcity").val(''),
    $("#editcountry").val(''),
    $("#editpostalcode").val('')
}















