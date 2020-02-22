
    var sandbox;
    var hltr;
    var tagColor='#fff';
    var $conts;
    var tabsid='one';
    var remove='#fff';


$(document).ready(function () {

    sandbox = document.getElementById('sandbox');
    $conts = $(".content");

    // hltr = new TextHighlighter(sandbox);

    $(".btn-select").each(function (e) {
        var value = $(this).find("ul li.selected").html();
        if (value != undefined) {
            $(this).find(".btn-select-input").val(value);
            $(this).find(".btn-select-value").html(value);
        }
    });
    //getAnnotation();


});
$('#search_bar').keyup(function() {
     var pdf_id = $('#pdf_id_field').val();


        $.ajax({
            type: "POST",
            url: "/tagging_tool/searchTag/",
            dataType: "json",
            async: true,
            data: {
                pdf_id: pdf_id,
                search_bar2 : $('#search_bar').val(),
                csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val()
            },
            success: searchSuccess,
            dataType: 'html'
        });



    });
$(document).on('click', '.btn-select', function (e) {
    e.preventDefault();
    var ul = $(this).find("ul");
    if ($(this).hasClass("active")) {
        if (ul.find("li").is(e.target)) {
            var target = $(e.target);
            target.addClass("selected").siblings().removeClass("selected");
            var value = target.html();
            $(this).find(".btn-select-input").val(value);
            $(this).find(".btn-select-value").html(value);
        }
        ul.hide();
        $(this).removeClass("active");
    }
    else {
        $('.btn-select').not(this).each(function () {
            $(this).removeClass("active").find("ul").hide();
        });
        ul.slideDown(300);
        $(this).addClass("active");
    }
});
$(document).on('click', function (e) {
    var target = $(e.target).closest(".btn-select");
    if (!target.length) {
        $(".btn-select").removeClass("active").find("ul").hide();
    }
});

function showTabsId(asd){
    tabsid=asd;

}
function myFunction(el) {
    var contents = $(el).attr('id');
    remove=contents;

    // hltr.setColor(contents);

    tagColor=contents

}
function myFr(el) {

    if(remove=='#fff')
        return;
    var contents = $(el).attr('id');

    if(getSelectedText().length!=0)
     var csrf = $('#csrf_token').val()
    //alert("Id: "+contents+" TagValue: "+getSelectedText()+" TagColorNumber: " +tagColor+' csrf: '+csrf)

    if( $.trim(getSelectedText()).length == 0)
    {
        //alert("empty")
        return 0
    }
    var mainDiv = document.getElementById("sandboxul");
    // var sel = getSelectionCharOffsetsWithin(mainDiv);
     var sel = getFirstRange(mainDiv);
    //alert(sel.start + ": " + sel.end);

    //var r = confirm("Text:  "+ $.trim(getSelectedText()) +"\n\nAre You Sure to Add Annotation?");
    r=true;
    if (r === true) {
        $.ajax({
            type: "POST",
            url: "/tagging_tool/saveTag/",
            dataType: "json",
            async: true,
            data: {
                pdf_pk: contents,
                text_sequence: $.trim(getSelectedText()),
                tag_color: tagColor,
                start: sel.start ,
                end: sel.end,
                csrfmiddlewaretoken: csrf
            },
            success: function (json) {
                //alert(json.result);

                var selected = $('#tag_div').hasClass("selected");

                if (typeof selected !== typeof undefined && selected !== false) {
                    getAnnotation();

                }

            }
        });
    }

}
function getSelectedText() {
        if (window.getSelection) {
            return window.getSelection().toString();
        } else if (document.selection) {
            return document.selection.createRange().text;
        }
        return '';
    }
function deleteAnnotation(ann_id) {
    var csrf = $('#csrf_token').val();
    var id = $('#pdf_id_field').val();
    var r = confirm("Are You Sure to Delete Annotation?");
    if (r == true)
    {
        $.ajax({
            type: "POST",
            url: "/tagging_tool/deleteAnnotation/",
            dataType: "json",
            async: true,
            data:{
                ann_id: ann_id,
                current_pdf_id:id,
                csrfmiddlewaretoken: csrf
            },
            success: function(json) {

                //$(".getFullText").empty();
                //alert($('.getFullText').innerHTML+' hey')
                 $("#sandboxul").empty();


                data =jQuery.parseJSON (json.data);
                //console.log(data)


                getFullText();
                // getAnnotation();

            }
        });

    }

}
function getAnnotation() {
        //getFullText();
    $("#operations_tab").empty();
    //$("#search_bar").show();
    document.getElementById("search_bar").style.visibility = "visible";

    var pdf_id = $('#pdf_id_field').val();
    var csrf = $('#csrf_token').val()
            //alert(pdf_id);
    $.ajax({
        type: "POST",
        url: "/tagging_tool/getAnnotation/",
        dataType: "json",
        async: true,
        data: {
            pdf_id: pdf_id,
            csrfmiddlewaretoken: csrf
        },
        success: function (json) {

            //alert(json.result);
            $("#operations_tab").empty();
            console.log(json)

            data = jQuery.parseJSON(json.datas);
            tags = jQuery.parseJSON(json.tags);

            //console.log(data)
            //console.log(tags)
            var tagName = "";
            document.getElementById('search_bar').style.visibility = 'visible';


            $.each(data, function (index, element) {
                try {
                    //alert(element.fields.text_sequence  + " - " +  element.fields.tag);
                    var tagName = ""
                    var tagColor=""

                    $.each(tags, function (index2, element2) {
                        if (element2.pk == element.fields.tag) {
                            tagName = element2.fields.tag_value;
                            tagColor=element2.fields.tag_color;

                            return false;
                        }
                    });
                    //$("#operations_tab").append('<li class="list-group-item">'+element.fields.text_sequence + " - " + tagName +'<span class="badge">12</span></li>');

                    // $("#operations_tab").append('<div class="row" id =' + element.pk + ' ><div class="col-md-12"> <li class="list-group-item">' + element.fields.text_sequence + " - " + tagName + '<i onclick="deleteAnnotation(\' + element.pk + \')" class="glyphicon glyphicon-remove" style="color:#e81b22;cursor: pointer;></i></li> </div></div>');
                    $("#operations_tab").append('<div class="row" ><div class="col-md-10 col-md-push-1"><span onclick="deleteAnnotation(' + element.pk + ')" class="glyphicon glyphicon-remove" style="color:#e81b22;cursor: pointer;margin-left:96%;top:20px;z-index: 3"></span> <li class="list-group-item" style="border:none;cursor: pointer;" onclick="moveToAnnotation(' + element.pk + ')">' + element.fields.text_sequence + " - " + tagName + '</li></div></div>');

                    $conts.highlight(element.fields.text_sequence,tagColor,element.pk);

                    //alert(element.fields.text_sequence + " - " + tagName);
                }
                catch (e) {
                    console.log("yo " + e);
                }
            });
        }
    });
}
function getAnnotation2() {


    var pdf_id = $('#pdf_id_field').val();
    var csrf = $('#csrf_token').val()
            //alert(pdf_id);
    $.ajax({
        type: "POST",
        url: "/tagging_tool/getAnnotation/",
        dataType: "json",
        async: true,
        data: {
            pdf_id: pdf_id,
            csrfmiddlewaretoken: csrf
        },
        success: function (json) {

            data = jQuery.parseJSON(json.datas);
            tags = jQuery.parseJSON(json.tags);

            var tagName = "";

            $.each(data, function (index, element) {
                try {
                    var tagName = ""
                    var tagColor=""

                    $.each(tags, function (index2, element2) {
                        if (element2.pk == element.fields.tag) {
                            tagName = element2.fields.tag_value;
                            tagColor=element2.fields.tag_color;

                            return false;
                        }
                    });
                    $conts.highlight(element.fields.text_sequence,tagColor,element.pk);
                }
                catch (e) {
                    console.log("yo " + e);
                }
            });
        }
    });
}
function moveToAnnotation(id) {
    //alert(id)
    $('html, body').animate({
        scrollTop: $("#"+id).offset().top
    }, 500);
}
function getMetaData() {
    $("#operations_tab").empty();
    var pdf_id = $('#pdf_id_field').val();
    var csrf = $('#csrf_token').val()
            //alert(pdf_id);
    $.ajax({
        type: "POST",
        url: "/tagging_tool/getMetaData/",
        dataType: "json",
        async: true,
        data: {
            pdf_id: pdf_id,
            csrfmiddlewaretoken: csrf
        },
        success: function (json) {

            $("#operations_tab").empty();

            meta =jQuery.parseJSON (json.meta);
            keywords =jQuery.parseJSON (json.keywords);
            //console.log(meta);
            //console.log(keywords);
            $.each(meta, function (index, element) {
                try {
                    var type ="Undefined";
                    if(element.fields.type ===1)
                    {
                        type ="Conference";

                    }
                    else if(element.fields.type ===2)
                    {
                        type ="Journal";

                    }
                    $("#operations_tab").append('<label>Title:</label>');
                    $("#operations_tab").append('<li class="list-group-item">' + element.fields.title +'</li>');
                    $("#operations_tab").append('<label>Secondary Title:</label>');
                    $("#operations_tab").append('<div class="row"><div class="col-md-12"> <li class="list-group-item">' + element.fields.secondary_title +'</li> </div></div>');
                    $("#operations_tab").append('<label>Type:</label>');
                    $("#operations_tab").append('<div class="row"><div class="col-md-12"> <li class="list-group-item">' + type +'</li> </div></div>');
                    $("#operations_tab").append('<label>DOI:</label>');
                    $("#operations_tab").append('<div class="row"><div class="col-md-12"> <li class="list-group-item">' + element.fields.DOI +'</li> </div></div>');
                    $("#operations_tab").append('<label>Publish Date:</label>');
                    $("#operations_tab").append('<div class="row"><div class="col-md-12"> <li class="list-group-item">' + element.fields.publish_date +'</li> </div></div>');
                    $("#operations_tab").append('<label>Abstract:</label>');
                    $("#operations_tab").append('<div class="row"><div class="col-md-12"> <li class="list-group-item">' + element.fields.abstract +'</li> </div></div>');
                }
                catch (e) {
                    console.log("yo " + e);
                }
            });
            $("#operations_tab").append('<label>Keywords:</label>');
            $.each(keywords, function (index, element) {
                try {
                    $("#operations_tab").append('<li class="list-group-item">' + element.fields.term +'</li>');
                }
                catch (e) {
                    console.log("yo " + e);
                }
            });

        }
    });
}
function getCitation() {
    $("#operations_tab").empty();

    var pdf_id = $('#pdf_id_field').val();
    var csrf = $('#csrf_token').val()
            //alert(pdf_id);
    $.ajax({
        type: "POST",
        url: "/tagging_tool/getCitation/",
        dataType: "json",
        async: true,
        data: {
            pdf_id: pdf_id,
            csrfmiddlewaretoken: csrf
        },
        success: function (json) {

            //alert(json.result);
            $("#operations_tab").empty();
            //console.log(json)
            references =jQuery.parseJSON (json.references);

            //console.log(references);
            count =1;
            $.each(references, function (index, element) {
                try {
                    var type ="Undefined";
                    if(element.fields.type ===1)
                    {
                        type ="Conference";

                    }
                    else if(element.fields.type ===2)
                    {
                        type ="Journal";

                    }
                    $("#operations_tab").append('<label>Reference '+ count+':</label><br>');
                    $("#operations_tab").append('<label>Title:</label>');
                    $("#operations_tab").append('<li class="list-group-item">' + element.fields.title +'</li>');
                    $("#operations_tab").append('<label>Secondary Title:</label>');
                    $("#operations_tab").append(' <li class="list-group-item">' + element.fields.secondary_title +'</li>');
                    $("#operations_tab").append('<label>Volume:</label>');
                    $("#operations_tab").append(' <li class="list-group-item">' + element.fields.volume +'</li>');
                    $("#operations_tab").append('<label>Editor:</label>');
                    $("#operations_tab").append(' <li class="list-group-item">' + element.fields.editor +'</li>');
                    $("#operations_tab").append('<label>Publish Date:</label>');
                    $("#operations_tab").append('<li class="list-group-item">' + element.fields.publish_date +'</li>');
                    $("#operations_tab").append('<label>Publisher:</label>');
                    $("#operations_tab").append('<li class="list-group-item">' + element.fields.publisher +'</li>');
                    $("#operations_tab").append('<label>Pages:</label>');
                    $("#operations_tab").append('<li class="list-group-item">' + element.fields.page_From + '-' + element.fields.page_To + '</li>');
                    $("#operations_tab").append('<label>Online Reference:</label>');
                    $("#operations_tab").append('<li class="list-group-item">' + element.fields.online_Reference +'</li>');
                    $("#operations_tab").append('<label>Type:</label>');
                    $("#operations_tab").append('<li class="list-group-item">' + type +'</li>');
                    $("#operations_tab").append('<hr>');
                    count = count +1;
                }
                catch (e) {
                    console.log("yo " + e);
                }
            });

        }
    });
}
function getAllTags() {
    var pdf_id = $('#pdf_id_field').val();
    var csrf = $('#csrf_token').val()
            //alert(pdf_id);
    $.ajax({
        type: "POST",
        url: "/tagging_tool/getAllTags/",
        dataType: "json",
        async: true,
        data: {
            pdf_id: pdf_id,
            csrfmiddlewaretoken: csrf
        },
        success: function (json) {

            //alert(json.result);
            $("#alltags").empty();
            allTags =jQuery.parseJSON (json.allTags);

            //console.log(allTags);

            $.each(allTags, function (index, element) {
                try {
                    //console.log(element.fields.lemma);
                    if(element.fields.isVisible === true) {
                        if (element.fields.isDeleteable === false) {

                            // $("#alltags").append('<li onclick=\"myFunction(this); selectedTag(\'' + element.fields.tag_color + '\',\'' + element.fields.tag_value + '\'); \" id=' + element.fields.tag_color + '><a href=\"#\" title=\'' + element.fields.description +'\' ><span class=\"fa\" style=\'background:' + element.fields.tag_color + ';color: white;\'></span>&nbsp;' + element.fields.tag_value + '</a></li><hr>');
                            $("#alltags").append('<li onclick=\"myFunction(this); selectedTag(\'' + element.fields.tag_color + '\',\'' + element.fields.tag_value + '\'); \" id=' + element.fields.tag_color + '><a href="#three" title=\'' + element.fields.description + '\'><span class=\"fa\" style=\'background:' + element.fields.tag_color + ';color: white;\'></span>&nbsp;' + element.fields.tag_value + '</li><hr style="margin: 0px;">');


                        }
                        else {
                            $("#alltags").append('<li onclick=\"myFunction(this); selectedTag(\'' + element.fields.tag_color + '\',\'' + element.fields.tag_value + '\'); \" id=' + element.fields.tag_color + '><a href=\"#three" title=\'' + element.fields.description + '\'><span class=\"fa\" style=\'background:' + element.fields.tag_color + ';color: white;\'></span>&nbsp;' + element.fields.tag_value + '<span  onclick="deleteTag(' + element.pk + ')" class="glyphicon glyphicon-remove" style="color:#e81b22;cursor: pointer; " ></span></a></li><hr>');

                        }
                    }
                }
                catch(e)
                {
                    console.log("yo " + e);
                    }
            });



        }
    });
    
}
function getSections() {
    document.getElementById("search_bar").style.visibility = "hidden";
    //$('#search_bar').style.visibility = "hidden";
    var pdf_id = $('#pdf_id_field').val();
    var csrf = $('#csrf_token').val()
    //alert(pdf_id);
    $("#operations_tab").empty();

    $.ajax({
        type: "POST",
        url: "/tagging_tool/getSections/",
        dataType: "json",
        async: true,
        data: {
            pdf_id: pdf_id,
            csrfmiddlewaretoken: csrf
        },
        success: function (json) {

            //alert(json.result);
            sections = jQuery.parseJSON(json.sections);

            //console.log(allTags);
            $.each(sections, function (index, element) {
                try {
                    //console.log(element.fields.lemma);
                    if (element.fields.section_number === null) {
                        $("#operations_tab").append('<li><a href="#three" onclick="moveToSection(' + element.pk + ')">' + element.fields.text + '</a></li>');
                    }
                    else {
                        $("#operations_tab").append('<li><a href="#three" onclick="moveToSection(' + element.pk + ')">' + element.fields.section_number + ' ' + element.fields.text + '</a></li>');
                    }
                }
                catch (e) {
                    console.log("yo " + e);
                }
            });

            getFullText(22);


        }
    });

}
function moveToSection(id) {
    //alert(id)
    $('html, body').animate({
        scrollTop: $("#s"+id).offset().top
    }, 500);
}
function selectedTag(color,value) {
    document.getElementById('selectedtag').style.visibility = 'visible';
    $("#selectdtagLI").empty();
    $("#selectdtagLI").append('<label>Selected: </label><span class=\"fa\" style=\'background:'+color+';color: white;\'></span>&nbsp;'+value+'<span  onclick="removeSelectedTag()" class="glyphicon glyphicon-remove" style="color:#e81b22;cursor: pointer;margin-left:15%; " ></span>');


}
function removeSelectedTag() {
    // hltr.setColor("#fff");
    remove='#fff';
    $("#selectdtagLI").empty();
    document.getElementById('selectedtag').style.visibility = 'hidden';
}
function deleteTag(id) {

    var r = confirm("Are You Sure to Delete Tag?");
    if (r == true) {


        var csrf = $('#csrf_token').val()

        $.ajax({
            type: "POST",
            url: "/tagging_tool/deleteTag/",
            dataType: "json",
            async: true,
            data:{
                tag_id: id,
                csrfmiddlewaretoken: csrf
            },
            success: function(json) {
                alert(json.result)
                document.getElementById('selectedtag').style.visibility = 'hidden';
                $("#selectdtagLI").empty();
                remove='#fff';
                getAllTags();

            }
        });
    }

}
function searchSuccess(data, textStatus, jqXHR) {
     $("#operations_tab").empty();
      $('#operations_tab').html(data);
       var searchTerm = $('#search_bar').val()

        // remove any old highlighted terms
        $('#operations_tab').fahadremoveHighlight();

        // disable highlighting if empty
        if ( searchTerm ) {
            // highlight the new term
            $('#operations_tab').fahadhighlight( searchTerm );
        }

}

function getSelectionCharOffsetsWithin(element) {
    var start = 0, end = 0;
    var sel, range, priorRange;
    if (typeof window.getSelection != "undefined") {
        range = window.getSelection().getRangeAt(0);
        // alert(range)
        priorRange = range.cloneRange();
        priorRange.selectNodeContents(element);
        priorRange.setEnd(range.startContainer, range.startOffset);
        start = priorRange.toString().length;
        end = start + range.toString().length;
        //start = range.startOffset;
        //end = range.endOffset-1;
    } else if (typeof document.selection != "undefined" &&
            (sel = document.selection).type != "Control") {
        range = sel.createRange();
        priorRange = document.body.createTextRange();
        priorRange.moveToElementText(element);
        priorRange.setEndPoint("EndToStart", range);
        start = priorRange.text.length;
        end = start + range.text.length;
    }
    start=start-2;
    end=end-3;

    // var span = document.createElement("span");
    // span.style.fontWeight = "bold";
    // span.style.backgroundColor = tagColor;
    // range.surroundContents(span);
    // sel.removeAllRanges();
    // sel.addRange(range);

    //alert(start + " " + end)


    return {
        start: start,
        end: end
    };
}
function getFirstRange(element) {
            // var sel = rangy.getSelection();
            var start = 0, end = 0;
            var sel, range, priorRange;

            //range = window.getSelection().getRangeAt(0);

            //alert(range.toString().length);
            //
            // selectedElement=range.toString();
            // selectedElementLenght=range.toString().length;
            //
            //
            // // alert('Hey ' + selectedElement[selectedElementLenght-1]);
            //
            // if(selectedElement[0]==' ' || selectedElement[selectedElementLenght-1]==' ')
            // {
            //     alert("Has space");
            // }

            if (typeof window.getSelection != "undefined") {
                range = window.getSelection().getRangeAt(0);

                //alert(range)
                priorRange = range.cloneRange();
                priorRange.selectNodeContents(element);
                priorRange.setEnd(range.startContainer, range.startOffset);
                start = priorRange.toString().length;
                end = start + range.toString().length;
                //start = range.startOffset;
                //end = range.endOffset-1;
            } else if (typeof document.selection != "undefined" &&
                    (sel = document.selection).type != "Control") {
                range = sel.createRange();
                priorRange = document.body.createTextRange();
                priorRange.moveToElementText(element);
                priorRange.setEndPoint("EndToStart", range);
                start = priorRange.text.length;
                end = start + range.text.length;
            }
            start=start-2;
            end=end-3;
              //alert(start+ ' ' + end)
            //alert('range is '+ range)
            //alert('start range: '+ start+ ' ' +'end range: '+ end)

            var mys=start;
            var mye=end;
            //
            // String.prototype.insertTextAtIndices = function (text) {
            //     return this.replace(/./g, function (char, index) {
            //         return text[index] ? text[index] + char : char;
            //     });
            // };
            // var range = {
            //     20: "<span style='color:red'>",
            //     30: "</span>"
            // };
            // alert(document.getElementById("text_para").innerText);
            // document.getElementById("text_para").innerHTML =
            //     document.getElementById("text_para").innerHTML.insertTextAtIndices(range);
            //


            //  var text = document.getElementById("text_para").innerText
            //
            // var first = text.substring(0,start);
            // var mid=text.substring(start+1,end+2);
            //   var second = text.substring(end+3,text.length);
            //   alert('f '+mid)
            //
            //   $("#text_para").text(first + "<span style='background-color:red'>" + mid + "</span>"+second);
              //$("#text_para").contents().unwrap();

            //var span = document.createElement("span");

            // span.style.backgroundColor = tagColor;
            // range.surroundContents(span);
            //sel.removeAllRanges();
            //sel.addRange(range);

            //alert(start+ ' ' + end)

            // var ranges=sel.getRangeAt(0);
            // alert(ranges.startOffset + ' ' + ranges.endOffset);
            // return sel.rangeCount ? sel.getRangeAt(0) : null;

            // var r = document.createRange();
            // var s = window.getSelection()
            //
            // var pos = 0;
            //
            // function dig(el){
            //     $(el).contents().each(function(i,e){
            //         if (e.nodeType==1){
            //             // not a textnode
            //          dig(e);
            //         }else{
            //             if (pos<start){
            //                if (pos+e.length>=start){
            //                 range.setStart(e, start-pos);
            //                }
            //             }
            //
            //             if (pos<end){
            //                if (pos+e.length>=end){
            //                 range.setEnd(e, end-pos);
            //                }
            //             }
            //
            //             pos = pos+e.length;
            //         }
            //     });
            // }

            // var start,end, range;
            //
            // function highlight(element,st,en){
            //     range = document.createRange();
            //     start = st;
            //     end = en;
            //     dig(element);
            //     s.addRange(range);
            //
            // }
            // highlight($('#sandbox'),mys,mye);
            //     dig($('#sandbox'));


            // var ra = s.getRangeAt(0);
            var ra=range;

            var newNode = document.createElement("span");
            newNode.setAttribute("style", "background-color:"+remove);
            newNode.appendChild(ra.extractContents());
            ra.insertNode(newNode);


            selectedElement=range.toString();
            selectedElementLenght=range.toString().length;


            // alert('Hey ' + selectedElement[selectedElementLenght-1]);

            if(selectedElement[0]==' ')
            {
                countIndex=0;
                spaceCount=0;
                while(selectedElement[countIndex]==' ' && countIndex< selectedElementLenght)
                {
                    spaceCount++;
                    countIndex++;
                }
                start=start+spaceCount;
            }

            if(selectedElement[selectedElementLenght-1]==' ')
            {
                countIndex=selectedElementLenght-1;
                spaceCount=0;
                while(selectedElement[countIndex]==' ' && countIndex>=0)
                {
                    spaceCount++;
                    countIndex--;
                }
                end=end-spaceCount;
            }



    return {
        start: start,
        end: end
    };


}



