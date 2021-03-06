/*:
@plugindesc
ベースプラグイン Ver1.2.0

@target MZ
@author ポテトドラゴン
@url https://raw.githubusercontent.com/potagon/RPGMakerMZ/master/plugins/Potagon.js

@help
ほとんどのプラグインで必要になるので、
必ずダウンロードして他のプラグインの最上部に配置してください。
*/

/*
Copyright (c) 2021 ポテトドラゴン
Released under the MIT License.
https://opensource.org/licenses/mit-license.php

・Ver1.2.0(2021/1/11)
- ファイルの存在判定処理を追加
- class を使用するように変更
*/

/**
 * 共通処理
 *
 * @class
 */
class Potagon {
    /**
     * プラグイン名取得
     *
     * @returns {string} プラグイン名
     */
    static getPluginName() {
        return document.currentScript.src.replace(/.+(Potagon.+)\.js/, '$1');
    }

    /**
     * 真偽値変換
     *
     * @param {string} bool - 真偽値に変換する文字列
     * @returns {boolean} 真偽値に変換した値
     */
    static convertBool(bool) {
        if (bool === "false" || bool === '') {
            return false;
        } else {
            return true;
        }
    }

    /**
     * 配列(数値)変換
     *
     * @param {string} data - 配列に変換する文字列
     * @returns {array} 配列に変換した値
     */
    static numberArray(data) {
        let arr = [];
        for (let datum of JSON.parse(data)) {
            arr.push(Number(datum));
        }
        return arr;
    }

    /**
     * 配列(文字列)変換
     *
     * @param {string} data - 配列に変換する文字列
     * @returns {array} 配列に変換した値
     */
    static stringArray(data) {
        let arr = [];
        for (let datum of JSON.parse(data)) {
            arr.push(String(datum));
        }
        return arr;
    }

    /**
     * 通常検索
     *
     * @param {array} data - 検索対象のデータ
     * @param {any} id - 検索する数値や文字列
     * @param {string} column - 検索して見つかったときに返すカラム(指定しない場合は、全データを返す)
     * @param {string} search_column - 検索対象のカラム(指定しない場合は、カラム を指定せず検索)
     * @param {any} val - 検索しても見つからなかった場合に返すデータ
     * @param {number} initial - 検索対象をどこから検索するか
     * @returns {any} 検索した結果
     */
    static search(data, id, column = "name", search_column = "id", val = "", initial = 1) {
        if (!id) {
            return val;
        }

        for (let i = initial; i < data.length; i++) {
            if (search_column) {
                if (data[i][search_column] == id) {
                    if (column) {
                        val = data[i][column];
                    } else {
                        val = data[i];
                    }
                    break;
                }
            } else if (i == id) {
                val = data[i];
                break;
            }
        }
        return val;
    }

    /**
     * 名前検索
     *
     * @param {array} data - 検索対象のデータ
     * @param {any} id - 検索する数値や文字列
     * @param {string} column - 検索して見つかったときに返すカラム(指定しない場合は、全データを返す)
     * @param {string} search_column - 検索対象のカラム(指定しない場合は、カラム を指定せず検索)
     * @param {any} val - 検索しても見つからなかった場合に返すデータ
     * @param {number} initial - 検索対象をどこから検索するか
     * @returns {any} 検索した結果
     */
    static nameSearch(data, name, column = "id", search_column = "name", val = "", initial = 1) {
        return this.search(data, name, column, search_column, val, initial);
    }

    /**
     * アイテム検索
     *
     * @param {array} data - 検索対象のデータ
     * @param {any} id - 検索する数値や文字列
     * @param {string} column - 検索して見つかったときに返すカラム(指定しない場合は、全データを返す)
     * @param {string} search_column - 検索対象のカラム(指定しない場合は、カラム を指定せず検索)
     * @param {any} val - 検索しても見つからなかった場合に返すデータ
     * @param {number} initial - 検索対象をどこから検索するか
     * @returns {any} 検索した結果
     */
    static itemSearch(name, column = false, search_column = "name", val = false, initial = 1) {
        let item, weapon, armor = null;
        item = this.search($dataItems, name, column, search_column, val, initial);
        if (item) {
            return item;
        }
        weapon = this.search($dataWeapons, name, column, search_column, val, initial);
        if (weapon) {
            return weapon;
        }
        armor = this.search($dataArmors, name, column, search_column, val, initial);
        if (armor) {
            return armor;
        }
        return false;
    }

    /**
     * メタデータ取得
     *
     * @param {array} meta - メモ内のメタデータ
     * @param {string} tag - メタデータのタグ
     * @returns {string|boolean} メタデータの値(メタデータがない場合、false)
     */
    static meta(meta, tag) {
        if (meta) {
            const data = meta[tag];
            if (data) {
                return data.trim();
            }
        }
        return false;
    }

    /**
     * 配列用メタデータ取得
     *
     * @param {array} meta_data - 改行を含むメモ内のメモデータ
     * @param {string} delimiter - 区切り文字
     * @returns {array|boolean} メタデータの配列(メタデータがない場合、false)
     */
    static metaData(meta_data, delimiter = '\n') {
        if (meta_data) {
            const data = meta_data.split(delimiter);
            if (data) {
                return data;
            }
        }
        return false;
    }

    /**
     * ランダム処理
     *
     * @param {number} probability - 確率(0～100%)
     * @param {number} rate - 倍率
     */
    static random(probability, rate = 1) {
        return Math.random() <= probability / 100 * rate;
    }

    /**
     * ガチャ処理
     *
     * @param {number} seed - 乱数のシード値(最大値)
     * @param {array} rates - 抽選対象の確率
     * @returns {number} 抽選対象の配列インデックス
     */
    static gacha(seed, rates) {
        let sum = 0;
        const rand = Math.randomInt(seed);

        for (let i = 0; i < rates.length; i++) {
            sum += rates[i];
            if (rand < sum) {
                return i;
            }
        }
        return 0;
    }

    /**
     * 名前メモデータベース用: 習得するスキル
     *
     * @param {Game.Actor} actor - アクター情報
     * @returns {array} 習得するスキル
     */
    static learnings(actor) {
        const data = this.metaData(actor.currentClass().meta['スキル']);
        let learnings = [];
        if (data) {
            let learning_data = null;

            for (let i = 0; i < data.length; i++) {
                if (data[i]) {
                    learning_data = data[i].split(',');
                    learnings.push({
                        level: Number(learning_data[0]),
                        skillId: this.nameSearch($dataSkills, learning_data[1].trim())
                    });
                }
            }
        }
        return learnings;
    }

    /**
     * ファイルの存在判定
     *
     * @param {string} file_path - 存在をチェックするファイルのパス
     */
    static isExist(file_path) {
        if (StorageManager.isLocalMode()) {
            // ローカル実行

            // パス
            const path = require('path');
            const file = path.dirname(process.mainModule.filename) + file_path;

            // Node.jsのファイルオブジェクト作成
            const fs = require('fs');
            return fs.existsSync(file);
        } else {
            // ブラウザ実行
            const xhr = new XMLHttpRequest();
            try {
                xhr.open('GET', file_path, false); // false で同期処理(デフォルトは true で非同期)
                xhr.send();
                return true;
            } catch (e) {
                return false;
            }
        }
    }
}
