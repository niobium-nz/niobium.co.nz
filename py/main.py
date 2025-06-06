from azure.data.tables import TableServiceClient
import os
from pathlib import Path
import logging
import json


connection_string = ""
table_name = ""
table_client = None
# 获取上级目录中的模板文件
template_path = Path(__file__).parent.parent / 'src/tempIndex.html'

def init_table():
    global connection_string, table_name, table_client

    table_service = TableServiceClient.from_connection_string(connection_string)
    # 创建表（如果不存在）
    table_client = table_service.create_table_if_not_exists(table_name)

    # 插入数据
    entity = {
        "PartitionKey": "products",
        "RowKey": "1",
        "FileName": "Laptop",
        "WebTitle": "Laptop",
        "WebDescription": "Laptop",
        "WebKeywords": "Laptop",
        "ProductName": "Laptop",
        "ProductSubTitle": "Summer Collection",
        "NowPrice": "1,499",
        "OldPrice": "1,999",
    }
    table_client.upsert_entity(entity)




def replace_html_template(output_dir, entity):
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

    # 保存到dist目录，文件名取自entity['FileName']
    output_path = os.path.join(output_dir, f"{entity['FileName']}.html")
    with open(output_path, 'w', encoding='utf-8') as file:
        file.write(replaced_content)
    print(f"文件已保存至: {output_path}")


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
        replace_html_template(f"{Path(__file__).parent.parent}/src/dist", entity)
        # print(f"WebTitle: {entity['WebTitle']}, NowPrice: {entity['NowPrice']}")


if __name__ == "__main__":
    main()