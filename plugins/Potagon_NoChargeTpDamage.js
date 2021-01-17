/*:
@plugindesc
被ダメージ時にTPを回復しない Ver1.1.0

@target MZ
@author ポテトドラゴン
@url https://raw.githubusercontent.com/potagon/RPGMakerMZ/master/plugins/Potagon_NoChargeTpDamage.js

@help
被ダメージ時にTPを回復しないようになります。
*/

/*
Copyright (c) 2021 ポテトドラゴン
Released under the MIT License.
https://opensource.org/licenses/mit-license.php

・Ver1.1.0(2021/1/11)
- コピーライト更新
*/

/**
 * スプライトや行動に関するメソッドを追加したバトラーのクラスです。
 * このクラスは Game_Actor クラスと
 * Game_Enemy クラスのスーパークラスとして使用されます。
 *
 * @class
 */

/**
 * 被ダメージによる TP チャージ
 *
 * @param {} damageRate - 
 */
Game_Battler.prototype.chargeTpByDamage = function(damageRate) {};
