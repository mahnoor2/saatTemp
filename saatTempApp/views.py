from django.shortcuts import render
import os.path
from .models import *
from nltk.tokenize import sent_tokenize
import nltk
from django.http import HttpResponse
from django.core import serializers
import json


# Create your views here.

def index(request):
    try:
        if request.method == "POST":
            print("Upload..  1")
            txt_file = request.FILES["txt_file"]
            aaa= txt_file.content_type
            print(aaa)
            if aaa != "text/plain":
                context = {
                    'error_message': "Uploaded File is Not TEXT!"
                }
                return render(request, 'saatTempApp/index.html', context)

            PROJECT_PATH = os.path.abspath(os.path.dirname(__name__))
            name_wd_ext = txt_file.name

            name_wo_ext = name_wd_ext.replace(".txt", "")
            file_path = PROJECT_PATH + "/txt_dir/" + name_wd_ext

            print("Upload..  2")
            txt_obj = Text_files()
            txt_obj.txt = txt_file
            txt_obj.txt_name = txt_file.name
            txt_obj.save()
            # waiting for file to upload
            a = 0
            print("Upload..  3")

            a = 1

            full_text = fullText(txt_obj)
            for sent in sent_tokenize(full_text):
                size = len(sent)
                if (size >= 4):
                    sentence_obj = Sentences()
                    sentence_obj.txt = txt_obj
                    sentence_obj.sentence = sent
                    sentence_obj.sentence_id = a
                    sentence_obj.save()
                    a = a + 1
         #   while os.path.exists(file_path) == False:
          #          a = a+1
           # xmlMetaObj = pdftoxmlGrobid(PROJECT_PATH + "/pdf_dir/" + name_wd_ext )

            # if xmlMetaObj == -1:
            #     context = {
            #         'error_message': "Error Due to Grobid!"
            #     }
            #     return render(request, 'tagging_tool/index.html', context)
            #
            # if xmlMetaObj.title is None:
            #     xmlMetaObj.title = pdf_file.name
            # check2 = Pdf_files.objects.filter(pdf_title = xmlMetaObj.title )
            # if check2:
            #     pdf_obj.delete()
            # else:
            #
            #     meta_ret = xmlProcessing_meta(xmlMetaObj.xml, pdf_obj,name_wd_ext)
            #     if meta_ret == -1:
            #         context = {
            #             'error_message': "Error Due to Meta Extraction!"
            #         }
            #         return render(request, 'tagging_tool/index.html', context)
            #     ref_ret = xmlProcessing_refrence(xmlMetaObj.xml, pdf_obj)
            #     if ref_ret == -1:
            #         context = {
            #             'error_message': "Error Due to References Extraction!"
            #         }
            #         return render(request, 'tagging_tool/index.html', context)
            #
            #     print("Upload..  4")
            #     pdf_obj.xml =xmlMetaObj.xml
            #     pdf_obj.is_processed =1
            #     pdf_obj.save()
            #
            # print("Upload..  6")
            #
            # allTags = Tags.objects.all()
            # pdf_obj = Pdf_files.objects.filter(pdf_title = xmlMetaObj.title )
            # #lemmas = Lemma.objects.filter(pdf = pdf_obj[0])
            # #mytext = pdf_obj[0].full_text
            # refrence_obj = References.objects.filter(pdf=pdf_obj[0])
            # meta_obj = MetaData.objects.filter(pdf=pdf_obj[0])
            # kewords_obj = Keyword.objects.filter(meta=meta_obj[0])
            # myxml=xmlMetaObj.xml
            # newxml=str(myxml,'utf-8')
            # newxml=newxml.replace('\n', '<br />')
            #
            # print("Upload..  7")
            # context = {
            #     'tags': allTags,
            #     #'text': mytext,
            #     'pdf_id': pdf_obj[0].id,
            #     'refrence': refrence_obj,
            #     'keywords': kewords_obj,
            #     'meta_obj': meta_obj,
            #     'xml': newxml,
            #
            # }
            #
            # return render(request, 'tagging_tool/operation.html', context)

        else:
            allPdfFiles = Text_files.objects.all()
            context = {
                'pdfFiles': allPdfFiles,
            }
            return render(request, 'saatTempApp/index.html',context)
    except Exception as e:
        print(e)
        context = {
            'error_message': "Something went wrong!"
        }
        return render(request, 'saatTempApp/index.html', context)



def fullText(txt_obj = Text_files()):
    section = Section.objects.filter(txt = txt_obj)
    fulltext=""
    for ss in section:
        if ss.section_number is None:
            fulltext = fulltext + ss.text +"\n"
        else:
            fulltext = fulltext + ss.section_number+ " " + ss.text +"\n"

    return fulltext



def getSections(request):
    if request.method == "POST":
        response_data = {}
        try:
            txt_id = str(request.POST['txt_id'])
            txt_obj = Text_files.objects.get(pk=txt_id)

            sections = Section.objects.filter(txt=txt_obj,is_heading = True)

            sections_json = serializers.serialize('json', list(sections), fields=('text', 'section_number'))

            response_data['result'] = 'Success'
            response_data['sections'] = sections_json

        except Exception as e:
            response_data['result'] = 'error'
            print("Exception",e)
        return HttpResponse(json.dumps(response_data), content_type="application/json")





def aboutus(request):
    return render(request, 'saatTempApp/aboutus.html')


def contact(request):
    return render(request, 'saatTempApp/contact.html')
