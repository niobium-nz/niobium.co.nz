from azure.data.tables import TableServiceClient
import os
from pathlib import Path
import logging
import json


connection_string = ""
table_name = ""
table_client = None


def init_table():
    global connection_string, table_name, table_client

    table_service = TableServiceClient.from_connection_string(connection_string)
    # 创建表（如果不存在）
    table_client = table_service.create_table_if_not_exists(table_name)

    # 插入数据
    entity = {
        "PartitionKey": "products",
        "RowKey": "1",
        "AreaType": "nz",
        "FolderName": "digital",
        "FileName": "laptop",
        "WebTitle": "Laptop",
        "WebDescription": "Laptop",
        "WebKeywords": "Laptop",
        "ProductName": "Laptop",
        "ProductSubTitle": "Summer Collection",
        "NowPrice": "1,499",
        "OldPrice": "1,999",
        "DiscountPercent": "21",
        "FirstImg": "../images/new/person_transparent.png",
        "SecondTitle": "laptop",
        "SecondSubTitle": "laptop",
        "SecondImg": "../images/model_woman_1.png",
        "ThirdTitle": "New Denim Coat",
        "ThirdSubTitle": "#New Summer Collection 2019",
        "ThirdImg": "../images/model_5.png",
        "ProductDescription": "<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius repellat, dicta at laboriosam, nemo exercitationem itaque eveniet architecto cumque, deleniti commodi molestias repellendus quos sequi hic fugiat asperiores illum. Atque, in, fuga excepturi corrupti error corporis aliquam unde nostrum quas.</p><p>Accusantium dolor ratione maiores est deleniti nihil? Dignissimos est, sunt nulla illum autem in, quibusdam cumque recusandae, laudantium minima repellendus.</p>",
        "VideoCoverImg": "../images/new/hero_2.jpg",
        "VideoUrl": "https://vimeo.com/channels/staffpicks/93951774",
        "Comment": json.dumps([{"UserName":"Blake Ruiz","face":"../images/default.png","stars":5,"content":"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore etdolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex eacommodo"},
                    {"UserName":"Blake Ruiz","face":"../images/default.png","stars":5,"content":"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore etdolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex eacommodo"},
                    {"UserName":"Blake Ruiz","face":"../images/default.png","stars":5,"content":"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore etdolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex eacommodo"}]),
        "ProductSpecifications": json.dumps([{"ItemName": "Width", "ItemValue": "128mm"},
                                             {"ItemName": "Height", "ItemValue": "508mm"},
                                             {"ItemName": "Depth", "ItemValue": "85mm"},
                                             {"ItemName": "Weight", "ItemValue": "52gm"},
                                             {"ItemName": "Quality checking", "ItemValue": "yes"},
                                             {"ItemName": "Freshness Duration", "ItemValue": "03days"},
                                             {"ItemName": "When packeting", "ItemValue": "Without touch of hand"},
                                 {"ItemName": "Each Box contains", "ItemValue": "60pcs"}]),
        "Stars": json.dumps({"OverAll": "4.0", "TotalReviews": "3", "Star1Num": "1", "Star2Num": "2", "Star3Num": "3", "Star4Num": "4", "Star5Num": "5"}),
    }
    table_client.upsert_entity(entity)




def replace_html_template(output_dir, entity, template_path, fileName):
    # 确保输出目录存在
    Path(output_dir).mkdir(parents=True, exist_ok=True)

    # 读取HTML文件
    with open(template_path, 'r', encoding='utf-8') as file:
        html_content = file.read()

    # 替换占位符（假设entity是字典，包含name字段）
    replaced_content = html_content.replace('{{name}}', entity.get('name', ''))
    replaced_content = replaced_content.replace('{{WebTitle}}', entity.get('WebTitle', ''))
    replaced_content = replaced_content.replace('{{WebDescription}}', entity.get('WebDescription', ''))
    replaced_content = replaced_content.replace('{{WebKeywords}}', entity.get('WebKeywords', ''))
    replaced_content = replaced_content.replace('{{ProductName}}', entity.get('ProductName', ''))


    replaced_content = replaced_content.replace('{{CheckOutUrl}}', f"{entity['FileName']}_{entity['AreaType']}_checkout.html")
    replaced_content = replaced_content.replace('href="../src/', 'href="../')
    replaced_content = replaced_content.replace('src="../src/', 'src="../')

    comment_content = ""
    for Comment in json.loads(entity['Comment']):
        comment_content = comment_content + replace_comment(Comment['UserName'], Comment['face'], Comment['stars'], Comment['content'])

    replaced_content = replaced_content.replace('{{CommentContent}}', comment_content)


    product_specifications = ""
    for Comment in json.loads(entity['ProductSpecifications']):
        product_specifications = product_specifications + replace_product_specifications(Comment['ItemName'], Comment['ItemValue'])

    replaced_content = replaced_content.replace('{{ProductSpecifications}}', product_specifications)

    Stars = json.loads(entity['Stars'])




    # 保存到dist目录，文件名取自entity['FileName']
    output_path = os.path.join(output_dir, fileName)
    with open(output_path, 'w', encoding='utf-8') as file:
        file.write(replaced_content)
    print(f"文件已保存至: {output_path}")



def replace_comment(userName, face, star, comment):
    content = f'<div class="review_item">'
    content = content + f'<div class="media">'
    content = content + f'<div class="d-flex">'
    content = content + f'<img src="{face}" alt="">'
    content = content + f'</div><div class="media-body">'
    content = content + f'<h4>{userName}</h4>'
    content = content + f'<i class="fa fa-star"></i>'
    content = content + f'<i class="fa fa-star"></i>'
    content = content + f'<i class="fa fa-star"></i>'
    content = content + f'<i class="fa fa-star"></i>'
    content = content + f'<i class="fa fa-star"></i>'
    content = content + f'</div></div><p>'
    content = content + f'{comment}'
    content = content + f'</p></div>'
    return content


def replace_product_specifications(ItemName, ItemValue):
    content = f'<tr><td><span>{ItemName}</span></td><td><span>{ItemValue}</span></td></tr>'
    return content




def make_html_index(output_dir, entity):
    # 获取上级目录中的模板文件
    template_path = Path(__file__).parent.parent / 'template/product_index.html'
    replace_html_template(output_dir, entity, template_path, f"{entity['FileName']}_{entity['AreaType']}_index.html")

def make_html_checkout(output_dir, entity):
    template_path = Path(__file__).parent.parent / 'template/checkout.html'
    replace_html_template(output_dir, entity, template_path, f"{entity['FileName']}_{entity['AreaType']}_checkout.html")

def make_html(output_dir, entity):
    make_html_index(output_dir, entity)
    make_html_checkout(output_dir, entity)


def load_config(file_path="local.settings.json"):
    global connection_string, table_name
    """读取 JSON 格式的配置文件"""
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            config = json.load(f)  # 直接解析 JSON
            connection_string = config.get("connection_string")
            table_name = config.get("table_name")
    except FileNotFoundError:
        print(f"错误：配置文件 {file_path} 不存在")
    except json.JSONDecodeError:
        print(f"错误：配置文件 {file_path} 不是合法的 JSON 格式")


def main():
    # 程序主要逻辑
    print("Hello World!")
    load_config()
    init_table()
    # 查询数据
    queried_entities = table_client.query_entities("PartitionKey eq 'products'")
    for entity in queried_entities:
        make_html(f"{Path(__file__).parent.parent}/src/{entity['FolderName']}", entity)


if __name__ == "__main__":
    main()