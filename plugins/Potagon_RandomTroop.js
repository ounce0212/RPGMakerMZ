/*:
@plugindesc
敵グループランダム決定 Ver1.1.0

@target MZ
@author ポテトドラゴン
@url https://raw.githubusercontent.com/potagon/RPGMakerMZ/master/plugins/Potagon_RandomTroop.js

@help
敵グループ名に<MAX:8><MIN:1>を指定することで、
ランダムに敵キャラを出現出来るようにします。
*/

/*
Copyright (c) 2021 ポテトドラゴン
Released under the MIT License.
https://opensource.org/licenses/mit-license.php

・Ver1.1.0(2021/1/11)
- コピーライト更新
*/

// パラメータ定義
(() => {
    'use strict';

/**
 * セットアップ
 *
 * @param {} troopId - 
 */
const _Game_Troop_setup = Game_Troop.prototype.setup;
Game_Troop.prototype.setup = function(troopId) {
    this.clear();
    this._troopId = troopId;
    this._enemies = [];

    const max_pattern = /<max:\s*(\d+)>/i;
    const min_pattern = /<min:\s*(\d+)>/i;
    const fix_pattern = /<fix:(\s*.+?)>/i;
    const name        = this.troop().name;

    let max_match = name.match(max_pattern);
    let min_match = name.match(min_pattern);
    let fix_match = name.match(fix_pattern);

    if (max_match || min_match) {
        const members = this.troop().members;
        let max = members.length;
        let min = 1;
        if (max_match) {
            max = max_match[1];
        }
        if (min_match) {
            min = min_match[1];
        }

        // 敵キャラの出現数を算出
        max = Math.randomInt(max) + 1;
        if (max < min) {
            max = min;
        }

        // 抽選する敵キャラのIDを配列に格納
        let ary = [];
        for (const member of members) {
            if ($dataEnemies[member.enemyId]) {
                ary.push(member.enemyId);
            }
        }

        // 固定敵キャラの設定
        let fix = [];
        if (fix_match) {
            fix = fix_match[1].split(',')
        }

        // 敵キャラを抽選
        for (let i = 0; i < max; i++) {
            let enemyId = null;
            let index = fix[i];
            if (index) {
                index -= 1;
                enemyId = ary[index];
            } else {
                enemyId = ary[Math.floor(Math.random() * ary.length)];
            }
            const enemy = new Game_Enemy(enemyId, 0, 0);
            this._enemies.push(enemy);
        }

        // ● 同名の敵キャラに ABC などの文字を付加
        this.makeUniqueNames();
    } else {
        // タグがない場合は、通常処理を呼び出す。
        _Game_Troop_setup.apply(this, arguments);
    }
};

})();
