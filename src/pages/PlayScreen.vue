<script setup lang="ts">
// @ts-nocheck
import { Ref, ref } from 'vue'
import Task from '@/components/Task.vue'
import Sidebar from '@/components/Sidebar.vue'
import { components } from '@/openapi.gen';

var score = 1500

const keygraph = {
  // キーチェインの作成、初期化
  build: function (seq) {
    // タイプする文字列の保存、入力補完の初期化
    this._seq = seq;
    // this._autocomplete_registered = [];

    // ヘッダー、フッターのチェインを作成する。
    this._chain_head = Object.create(this._chain_proto);
    this._chain_head._seq_ptr = 0;
    this._chain_head._key = "HEAD";
    this._chain_head._node_id = 0;
    this._chains = [this._chain_head];

    const merge_parents = (parents) => {
      const node_equals = (p0, p1) => {
        const to_string = p => p._children?.map(e => e._node_id).sort().join(" ");
        return p0._key === p1._key && to_string(p0) == to_string(p1);
      }
      const replaced_parents = [];
      parents.map((parent) => [parent, []]).
        filter(([parent1, replaced]) => {
          // ノードが表すキーと子ノード一覧が同じノードを取得する。
          replaced.push(parents.find(parent0 => node_equals(parent0, parent1)));
          // 取得した親ノードが検索しているノードと違う場合はマージ対象となる。
          return replaced[0] !== parent1;
        }).forEach(([parent, replaced_parent]) => {
          // 削除されたことを表す _merged をセットする。これはデバッグ用に使用する。
          parent._merged = true;
          parent._children?.forEach(sibling => { sibling._parents.splice(sibling._parents.indexOf(parent), 1); });
          parent._parents?.forEach(granpa => {
            granpa._children.splice(granpa._children.indexOf(parent), 1);
            granpa._children.includes(replaced_parent[0]) || (() => {
              granpa._children.push(replaced_parent[0]);
              granpa._children.sort((e0, e1) => e0._node_id - e1._node_id)
            })();
            replaced_parent[0]._parents.includes(granpa) || replaced_parent[0]._parents.push(granpa);
          });
          replaced_parents.includes(replaced_parent[0]) || replaced_parents.push(replaced_parent[0]);
        });

      // 残った親は、その親がマージできる可能性があるので繰り返す。
      replaced_parents.filter(e => e._parents !== undefined).forEach(e => {
        merge_parents(e._parents/*.sort((e0,e1)=>e0._node_id-e1._node_id)*/);
      });
    };
    // 親ノード parent に key(ex: "wwha") の1文字ずつをノードとして追加する。
    const add_chains = (parent, key) => {
      let ch = parent;
      Array.from(key).forEach(k => {
        ch = ch.find_child(k) ?? Object.create(this._chain_proto).set(k, ch).store(this._chains);
      });
      return ch;
    };

    const open = [{ p: 0, parents: [this._chain_head] }];
    let n = undefined;
    while ((() => { n = open.shift(); return n; })() !== undefined) {
      merge_parents(n.parents);
      const parents = n.parents.filter(e => e._merged === undefined);
      this._char_keys_table.filter(ckeys => this._seq.substring(n.p).startsWith(ckeys.char))/*.sort((e0, e1) => e0.char.length
- e1.char.length)*/.forEach(ckeys => {
        const keys = typeof (ckeys.keys) === "function" ? ckeys.keys.bind(this)(this._seq.substring(n.p)) : ckeys.keys;
        const p1 = n.p + ckeys.char.length;
        const ch_es = [];
        // "っし" sshi のように2文字は優先的に keygraph.key_candidatesで選ばれるこれからタイプするキーパターンの代表に選ばれやすいように
        // _childrenの先頭に追加する。ただし、ノードマージで_childrenの順序は変わるので、必ず選ばれるというわけではない。
        const older = false;//ckeys.char.length === 2;
        (older ? [...keys].reverse() : keys).forEach(key => {
          parents.forEach(parent => {
            ch_es.push(add_chains(parent, key, older));
            ch_es.slice(-1)[0].set_seq_ptr(p1);
          });
        });
        // openに次の処理を追加
        const m = open.find(e => e.p === p1) ?? (() => { const m = { p: p1, parents: [] }; open.push(m); return m; })();
        m.parents.push(...ch_es);
      });
      // _char_keys_tableから該当する要素を抽出したあとで char の文字数の昇順でソートして上の処理をすれば子のソート処理は必要ない。
      // key_candidateで複数のキーパターンから1つが選ばれる基準が _char_keys_table の要素順になるためには、ここでソート処理をして、_char_keys_tableから要素を抽出して
      // 処理をする場合は何もソートをしないようにする。
      open.sort((e0, e1) => e0.p - e1.p);
    }

    // 現在のタイプ位置のセット
    this._chain_cur = this._chain_head;
    this._seq_ptr_cur = 0;
    this._key_done = "";
    return this._seq;
  },
  // キーチェック、正解した場合 true を返す。そのときは内部で保持する文字の現在位置も1つ先に進む。
  next: function (key) {
    key = this._input_key_maps[key] ?? key;

    // 入力自動補完の実行
    this._autocomplete_fired.forEach(a => a.key?.(key, this.next.bind(this)));

    const nx = this._chain_cur?.find_child(key);
    if (nx === undefined) {
      return false;
    }
    this._chain_cur = nx;
    this._key_done += key;
    const seq_ptr_cur0 = this._seq_ptr_cur;
    this._seq_ptr_cur = nx._seq_ptr ?? this._seq_ptr_cur;

    if (seq_ptr_cur0 !== this._seq_ptr_cur) {
      // 日本語の文字が先に進んだ場合
      this._autocomplete_fired = [];
      this._autocomplete_registered.forEach(a => {
        if (this._seq.substring(this._seq_ptr_cur + (a.seq_ptr_d ?? 0)).match(a.seq_pattern)) {
          a.fired?.(key, this.next.bind(this));
          if (a.key !== undefined) {
            this._autocomplete_fired.push(a);
          }
        }
      });
    }
    return true;
  },
  // 初期状態に戻す。
  reset: function () {
    this._seq = undefined;
    this._seq_ptr_cur = 0;
    this._chain_head = undefined;
    this._chain_cur = undefined;
    this._chains = undefined;
    this._key_done = "";
    this._autocomplete_fired = [];
    this._autocomplete_registered = [];
  },
  // 入力自動補完の登録
  register_autocomplete: function (autocomplete) {
    this._autocomplete_registered.push(autocomplete);
  },
  // 現在実施中の自動入力補完
  _autocomplete_fired: [],
  // 登録している自動入力補完
  _autocomplete_registered: [],
  // 自動入力設定用のデータフォーマット(メモ用で実際にはここからオブジェクトを作成していない)
  _autocomplete_proto: {
    // 入力補完が発動する文字の正規表現
    seq_pattern: undefined,
    // 発動したときに実行されるメソッド
    fired: undefined,
    // 発動後にキー入力があったときに実行されるメソッド
    key: undefined,
  },

  // すべての文字を打ち終わったかの判定
  is_finished: function () {
    return this._seq_ptr_cur === this._seq?.length;
  },
  // これまでに正解として打ったキーの履歴
  key_done: function () {
    return this._key_done;
  },
  // これから打たなければいけないキーの一例
  key_candidate: function () {
    let ch = this._chain_cur?._children?.[0];
    let str = "";
    while (ch !== undefined) {
      // キー候補のうち配列の最初の文字のみを使用する。
      str += ch._key;
      ch = ch._children?.[0];
    }
    return str;
  },
  // これまでに正解として打った日本語の履歴
  seq_done: function () {
    return this._seq?.substring(0, this._seq_ptr_cur);
  },
  // これから打つ日本語の文字列
  seq_candidates: function () {
    return this._seq?.substring(this._seq_ptr_cur);
  },

  // キーチェインの1つのノードを表す。
  // キーチェインは有向非循環グラフ(DAG)となる。
  _chain_proto: {
    find_child: function (k) {
      return this._children?.filter(ch => ch._key === k)[0];
    },
    // このノードが表すキー(ex: a)、親ノードを設定する。
    set: function (k, ch0, older) {
      // _node_idはキーチェインノードの識別子
      this._node_id = this._create_node_id();
      this._key = k;
      this._parents = [ch0];
      ch0._children ??= [];
      older ? ch0._children.unshift(this) : ch0._children.push(this);
      // ch0._children.push(this);
      return this;
    },
    store: function (storage) {
      storage.push(this);
      return this;
    },
    set_seq_ptr: function (seq_ptr) {
      this._seq_ptr = seq_ptr;
      return this;
    },
    get_seq_ptr: function () {
      return this._seq_ptr;
    },
    // この関数を呼び出すたびに、1つインクリメントされた数値を返す。
    // Object.createでprototypeを本オブジェクトに指定しても
    // プロトタイプの関数なので実体は1つとなり、どのオブジェクトから
    // 呼び出しても同じ関数が呼び出される。よって番号は1つずつ上がる。
    _create_node_id: (function () {
      let id = 0;
      return function () {
        id += 1;
        return id;
      };
    })(),
    // 子ノード一覧
    _children: undefined,
    // 親ノード一覧(ノードをマージするときのみ使用する)
    _parents: undefined,
    // このノードが表すキー1文字(例: a)
    _key: undefined,
    // このノードが日本語の文字の完了キーになっている場合、
    // キーグラフが表す日本語の文字番号（先頭文字を1とした通し番号）をセットする。
    _seq_ptr: undefined,
    // ノード番号、キーグラフのスタート地点のHEADを0として生成された順に番号が付けられる。
    _node_id: undefined,
    // マージされたノードは、この変数に true がセットされる。
    _merged: undefined,
  },

  // 入力文字シーケンス
  _seq: undefined,
  // 文字のカーソル位置
  _seq_ptr_cur: 0,
  // キーチェインのヘッダー（_chain_curのみあれば十分で処理として使わない予定だけど念のための保管しておく）
  _chain_head: undefined,
  // キーチェイン上の現在位置
  _chain_cur: undefined,
  // すべてのキーチェインを保存する。キーチェインを作成した後で冗長部分をマージするために使用する。
  _chains: undefined,

  // これまでに正解として打ったキーの履歴
  _key_done: "",

  // keydownイベントのkey変数の特殊文字をコードに変換する。
  // keyCodeを使うと改行が\rになったり、String.fromCharCodeで文字化したときに
  // 大文字になったりするので使っていない。
  _input_key_maps: {
    Enter: "\n",
    Tab: "\t",
  },

  // str: 日本語, key: 入力するキーボード
  // keygraph.key_candidateによって得られるこれから打たなければいけないキーパターンは複数となることが多いが、そのうち1つが選ばれる。
  // 選ばれる基準は、このテーブルの登録されている順序で決定される。順序は、charだけでなく keysの順序も考慮される。ただし関数型の"ん"
  // "n","nn"の順序だけは "nn" "n" に固定される（先にn->n というようにマージされてから次の文字が始まるため、1つ目のnの最初の子ノードは2つ目のnになるため）
  _char_keys_table: [
    // 関数で入力するキーを決定するもの
    {
      char: "ん", keys: function (seq) {
        // 文字シーケンスが指定されたキーで始まる可能性があるかどうか確認する
        const key_startsWith = (seq, ks) => {
          return this._char_keys_table.filter(ckeys => seq.startsWith(ckeys.char)).some(ckeys =>
            ckeys.keys.some(key => ks.includes(key[0]))
          );
        };
        // 「ん」が最後の1文字または「ん」の次の文字が母音またはn,yで始まる場合は、n 1つでの処理はできない。
        if (seq.length === 1 || key_startsWith(seq.substring(1), ["a", "i", "u", "e", "o", "n", "y"])) {
          // nnと2つ打つ必要がある。
          return ["nn", "xn"];
        } else {
          // 上記以外は、n 1文字でもOK
          return ["n", "nn", "xn"];
        }
      }
    },

    // 三文字コード
    { char: "っうぁ", keys: ["wwha"] },
    { char: "っうぃ", keys: ["wwhi"] },
    { char: "っうぇ", keys: ["wwhe"] },
    { char: "っうぉ", keys: ["wwho"] },
    { char: "っヴぁ", keys: ["vva"] },
    { char: "っヴぃ", keys: ["vvi", "vvyi"] },
    { char: "っヴぇ", keys: ["vve", "vvye"] },
    { char: "っヴぉ", keys: ["vvo"] },
    { char: "っヴゃ", keys: ["vvya"] },
    { char: "っヴゅ", keys: ["vvyu"] },
    { char: "っヴょ", keys: ["vvyo"] },
    { char: "っきゃ", keys: ["kkya"] },
    { char: "っきぃ", keys: ["kkyi"] },
    { char: "っきゅ", keys: ["kkyu"] },
    { char: "っきぇ", keys: ["kkye"] },
    { char: "っきょ", keys: ["kkyo"] },
    { char: "っぎゃ", keys: ["ggya"] },
    { char: "っぎぃ", keys: ["ggyi"] },
    { char: "っぎゅ", keys: ["ggyu"] },
    { char: "っぎぇ", keys: ["ggye"] },
    { char: "っぎょ", keys: ["ggyo"] },
    { char: "っくぁ", keys: ["qqa", "qqwa",] },
    { char: "っくぃ", keys: ["qqi", "qqwi", "qqyi"] },
    { char: "っくぅ", keys: ["qqwu"] },
    { char: "っくぇ", keys: ["qqe", "qqwe", "qqye"] },
    { char: "っくぉ", keys: ["qqo", "qqwo"] },
    { char: "っくゃ", keys: ["qqya"] },
    { char: "っくゅ", keys: ["qqyu"] },
    { char: "っくょ", keys: ["qqyo"] },
    { char: "っぐぁ", keys: ["ggwa"] },
    { char: "っぐぃ", keys: ["ggwi"] },
    { char: "っぐぅ", keys: ["ggwu"] },
    { char: "っぐぇ", keys: ["ggwe"] },
    { char: "っぐぉ", keys: ["ggwo"] },
    { char: "っしゃ", keys: ["ssya", "ssha"] },
    { char: "っしぃ", keys: ["ssyi"] },
    { char: "っしゅ", keys: ["ssyu", "sshu"] },
    { char: "っしぇ", keys: ["ssye", "sshe"] },
    { char: "っしょ", keys: ["ssyo", "ssho"] },
    { char: "っじゃ", keys: ["jja", "jjya", "zzya"] },
    { char: "っじぃ", keys: ["jjyi", "zzyi"] },
    { char: "っじゅ", keys: ["jju", "jjyu", "zzyu"] },
    { char: "っじぇ", keys: ["jje", "jjye", "zzye"] },
    { char: "っじょ", keys: ["jjo", "jjyo", "zzyo"] },
    { char: "っすぁ", keys: ["sswa"] },
    { char: "っすぃ", keys: ["sswi"] },
    { char: "っすぅ", keys: ["sswu"] },
    { char: "っすぇ", keys: ["sswe"] },
    { char: "っすぉ", keys: ["sswo"] },
    { char: "っちゃ", keys: ["ttya", "ccha"] },
    { char: "っちぃ", keys: ["ttyi"] },
    { char: "っちゅ", keys: ["ttyu", "cchu", "ccyu"] },
    { char: "っちぇ", keys: ["ttye", "cche", "ccye"] },
    { char: "っちょ", keys: ["ttyo", "ccho", "ccyo"] },
    { char: "っぢゃ", keys: ["ddya"] },
    { char: "っぢぃ", keys: ["ddyi"] },
    { char: "っぢゅ", keys: ["ddyu"] },
    { char: "っぢぇ", keys: ["ddye"] },
    { char: "っぢょ", keys: ["ddyo"] },
    { char: "っつぁ", keys: ["ttsa"] },
    { char: "っつぃ", keys: ["ttsi"] },
    { char: "っつぇ", keys: ["ttse"] },
    { char: "っつぉ", keys: ["ttso"] },
    { char: "ってゃ", keys: ["ttha"] },
    { char: "ってぃ", keys: ["tthi"] },
    { char: "ってゅ", keys: ["tthu"] },
    { char: "ってぇ", keys: ["tthe"] },
    { char: "ってょ", keys: ["ttho"] },
    { char: "っでゃ", keys: ["ddha"] },
    { char: "っでぃ", keys: ["ddhi"] },
    { char: "っでゅ", keys: ["ddhu"] },
    { char: "っでぇ", keys: ["ddhe"] },
    { char: "っでょ", keys: ["ddho"] },
    { char: "っとぁ", keys: ["ttwa"] },
    { char: "っとぃ", keys: ["ttwi"] },
    { char: "っとぅ", keys: ["ttwu"] },
    { char: "っとぇ", keys: ["ttwe"] },
    { char: "っとぉ", keys: ["ttwo"] },
    { char: "っどぁ", keys: ["ddwa"] },
    { char: "っどぃ", keys: ["ddwi"] },
    { char: "っどぅ", keys: ["ddwu"] },
    { char: "っどぇ", keys: ["ddwe"] },
    { char: "っどぉ", keys: ["ddwo"] },
    { char: "っひゃ", keys: ["hhya"] },
    { char: "っひぃ", keys: ["hhyi"] },
    { char: "っひゅ", keys: ["hhyu"] },
    { char: "っひぇ", keys: ["hhye"] },
    { char: "っひょ", keys: ["hhyo"] },
    { char: "っびゃ", keys: ["bbya"] },
    { char: "っびぃ", keys: ["bbyi"] },
    { char: "っびゅ", keys: ["bbyu"] },
    { char: "っびぇ", keys: ["bbye"] },
    { char: "っびょ", keys: ["bbyo"] },
    { char: "っぴゃ", keys: ["ppya"] },
    { char: "っぴぃ", keys: ["ppyi"] },
    { char: "っぴゅ", keys: ["ppyu"] },
    { char: "っぴぇ", keys: ["ppye"] },
    { char: "っぴょ", keys: ["ppyo"] },
    { char: "っふぁ", keys: ["ffa", "ffwa"] },
    { char: "っふぃ", keys: ["ffi", "ffwi", "ffyi"] },
    { char: "っふぅ", keys: ["ffwu"] },
    { char: "っふぇ", keys: ["ffe", "ffwe", "ffye"] },
    { char: "っふぉ", keys: ["ffo", "ffwo"] },
    { char: "っふゃ", keys: ["ffya"] },
    { char: "っふゅ", keys: ["ffyu"] },
    { char: "っふょ", keys: ["ffyo"] },
    { char: "っみゃ", keys: ["mmya"] },
    { char: "っみぃ", keys: ["mmyi"] },
    { char: "っみゅ", keys: ["mmyu"] },
    { char: "っみぇ", keys: ["mmye"] },
    { char: "っみょ", keys: ["mmyo"] },
    { char: "っりゃ", keys: ["rrya"] },
    { char: "っりぃ", keys: ["rryi"] },
    { char: "っりゅ", keys: ["rryu"] },
    { char: "っりぇ", keys: ["rrye"] },
    { char: "っりょ", keys: ["rryo"] },

    // 二文字コード
    { char: "いぇ", keys: ["ye"] },
    { char: "うぁ", keys: ["wha"] },
    { char: "うぃ", keys: ["whi"] },
    { char: "うぇ", keys: ["whe"] },
    { char: "うぉ", keys: ["who"] },
    { char: "ヴぁ", keys: ["va"] },
    { char: "ヴぃ", keys: ["vi", "vyi"] },
    { char: "ヴぇ", keys: ["ve", "vye"] },
    { char: "ヴぉ", keys: ["vo"] },
    { char: "ヴゃ", keys: ["vya"] },
    { char: "ヴゅ", keys: ["vyu"] },
    { char: "ヴょ", keys: ["vyo"] },
    { char: "きゃ", keys: ["kya"] },
    { char: "きぃ", keys: ["kyi"] },
    { char: "きゅ", keys: ["kyu"] },
    { char: "きぇ", keys: ["kye"] },
    { char: "きょ", keys: ["kyo"] },
    { char: "ぎゃ", keys: ["gya"] },
    { char: "ぎぃ", keys: ["gyi"] },
    { char: "ぎゅ", keys: ["gyu"] },
    { char: "ぎぇ", keys: ["gye"] },
    { char: "ぎょ", keys: ["gyo"] },
    { char: "くぁ", keys: ["qa", "qwa",] },
    { char: "くぃ", keys: ["qi", "qwi", "qyi"] },
    { char: "くぅ", keys: ["qwu"] },
    { char: "くぇ", keys: ["qe", "qwe", "qye"] },
    { char: "くぉ", keys: ["qo", "qwo"] },
    { char: "くゃ", keys: ["qya"] },
    { char: "くゅ", keys: ["qyu"] },
    { char: "くょ", keys: ["qyo"] },
    { char: "ぐぁ", keys: ["gwa"] },
    { char: "ぐぃ", keys: ["gwi"] },
    { char: "ぐぅ", keys: ["gwu"] },
    { char: "ぐぇ", keys: ["gwe"] },
    { char: "ぐぉ", keys: ["gwo"] },
    { char: "しゃ", keys: ["sya", "sha"] },
    { char: "しぃ", keys: ["syi"] },
    { char: "しゅ", keys: ["syu", "shu"] },
    { char: "しぇ", keys: ["sye", "she"] },
    { char: "しょ", keys: ["syo", "sho"] },
    { char: "じゃ", keys: ["ja", "jya", "zya"] },
    { char: "じぃ", keys: ["jyi", "zyi"] },
    { char: "じゅ", keys: ["ju", "jyu", "zyu"] },
    { char: "じぇ", keys: ["je", "jye", "zye"] },
    { char: "じょ", keys: ["jo", "jyo", "zyo"] },
    { char: "すぁ", keys: ["swa"] },
    { char: "すぃ", keys: ["swi"] },
    { char: "すぅ", keys: ["swu"] },
    { char: "すぇ", keys: ["swe"] },
    { char: "すぉ", keys: ["swo"] },
    { char: "ちゃ", keys: ["tya", "cha"] },
    { char: "ちぃ", keys: ["tyi"] },
    { char: "ちゅ", keys: ["tyu", "chu", "cyu"] },
    { char: "ちぇ", keys: ["tye", "che", "cye"] },
    { char: "ちょ", keys: ["tyo", "cho", "cyo"] },
    { char: "ぢゃ", keys: ["dya"] },
    { char: "ぢぃ", keys: ["dyi"] },
    { char: "ぢゅ", keys: ["dyu"] },
    { char: "ぢぇ", keys: ["dye"] },
    { char: "ぢょ", keys: ["dyo"] },
    { char: "つぁ", keys: ["tsa"] },
    { char: "つぃ", keys: ["tsi"] },
    { char: "つぇ", keys: ["tse"] },
    { char: "つぉ", keys: ["tso"] },
    { char: "てゃ", keys: ["tha"] },
    { char: "てぃ", keys: ["thi"] },
    { char: "てゅ", keys: ["thu"] },
    { char: "てぇ", keys: ["the"] },
    { char: "てょ", keys: ["tho"] },
    { char: "でゃ", keys: ["dha"] },
    { char: "でぃ", keys: ["dhi"] },
    { char: "でゅ", keys: ["dhu"] },
    { char: "でぇ", keys: ["dhe"] },
    { char: "でょ", keys: ["dho"] },
    { char: "とぁ", keys: ["twa"] },
    { char: "とぃ", keys: ["twi"] },
    { char: "とぅ", keys: ["twu"] },
    { char: "とぇ", keys: ["twe"] },
    { char: "とぉ", keys: ["two"] },
    { char: "どぁ", keys: ["dwa"] },
    { char: "どぃ", keys: ["dwi"] },
    { char: "どぅ", keys: ["dwu"] },
    { char: "どぇ", keys: ["dwe"] },
    { char: "どぉ", keys: ["dwo"] },
    { char: "にゃ", keys: ["nya"] },
    { char: "にぃ", keys: ["nyi"] },
    { char: "にゅ", keys: ["nyu"] },
    { char: "にぇ", keys: ["nye"] },
    { char: "にょ", keys: ["nyo"] },
    { char: "ひゃ", keys: ["hya"] },
    { char: "ひぃ", keys: ["hyi"] },
    { char: "ひゅ", keys: ["hyu"] },
    { char: "ひぇ", keys: ["hye"] },
    { char: "ひょ", keys: ["hyo"] },
    { char: "びゃ", keys: ["bya"] },
    { char: "びぃ", keys: ["byi"] },
    { char: "びゅ", keys: ["byu"] },
    { char: "びぇ", keys: ["bye"] },
    { char: "びょ", keys: ["byo"] },
    { char: "ぴゃ", keys: ["pya"] },
    { char: "ぴぃ", keys: ["pyi"] },
    { char: "ぴゅ", keys: ["pyu"] },
    { char: "ぴぇ", keys: ["pye"] },
    { char: "ぴょ", keys: ["pyo"] },
    { char: "ふぁ", keys: ["fa", "fwa"] },
    { char: "ふぃ", keys: ["fi", "fwi", "fyi"] },
    { char: "ふぅ", keys: ["fwu"] },
    { char: "ふぇ", keys: ["fe", "fwe", "fye"] },
    { char: "ふぉ", keys: ["fo", "fwo"] },
    { char: "ふゃ", keys: ["fya"] },
    { char: "ふゅ", keys: ["fyu"] },
    { char: "ふょ", keys: ["fyo"] },
    { char: "みゃ", keys: ["mya"] },
    { char: "みぃ", keys: ["myi"] },
    { char: "みゅ", keys: ["myu"] },
    { char: "みぇ", keys: ["mye"] },
    { char: "みょ", keys: ["myo"] },
    { char: "りゃ", keys: ["rya"] },
    { char: "りぃ", keys: ["ryi"] },
    { char: "りゅ", keys: ["ryu"] },
    { char: "りぇ", keys: ["rye"] },
    { char: "りょ", keys: ["ryo"] },
    { char: "っか", keys: ["kka",] },
    { char: "っき", keys: ["kki",] },
    { char: "っく", keys: ["kku", "qqu"] },
    { char: "っけ", keys: ["kke"] },
    { char: "っこ", keys: ["kko"] },
    { char: "っが", keys: ["gga",] },
    { char: "っぎ", keys: ["ggi",] },
    { char: "っぐ", keys: ["ggu"] },
    { char: "っげ", keys: ["gge"] },
    { char: "っご", keys: ["ggo"] },
    { char: "っさ", keys: ["ssa"] },
    { char: "っし", keys: ["ssi", "sshi", "cci"] },
    { char: "っす", keys: ["ssu"] },
    { char: "っせ", keys: ["sse"] },
    { char: "っそ", keys: ["sso"] },
    { char: "っざ", keys: ["zza"] },
    { char: "っじ", keys: ["jji", "zzi"] },
    { char: "っず", keys: ["zzu"] },
    { char: "っぜ", keys: ["zze"] },
    { char: "っぞ", keys: ["zzo"] },
    { char: "った", keys: ["tta"] },
    { char: "っち", keys: ["tti", "cchi"] },
    { char: "っつ", keys: ["ttu", "ttsu"] },
    { char: "って", keys: ["tte"] },
    { char: "っと", keys: ["tto"] },
    { char: "っだ", keys: ["dda"] },
    { char: "っぢ", keys: ["ddi"] },
    { char: "っづ", keys: ["ddu"] },
    { char: "っで", keys: ["dde"] },
    { char: "っど", keys: ["ddo"] },
    { char: "っは", keys: ["hha"] },
    { char: "っひ", keys: ["hhi"] },
    { char: "っふ", keys: ["ffu", "hhu"] },
    { char: "っへ", keys: ["hhe"] },
    { char: "っぱ", keys: ["ppa"] },
    { char: "っぴ", keys: ["ppi"] },
    { char: "っぷ", keys: ["ppu"] },
    { char: "っぺ", keys: ["ppe"] },
    { char: "っぽ", keys: ["ppo"] },
    { char: "っば", keys: ["pba"] },
    { char: "っび", keys: ["pbi"] },
    { char: "っぶ", keys: ["pbu"] },
    { char: "っべ", keys: ["pbe"] },
    { char: "っぼ", keys: ["pbo"] },
    { char: "っほ", keys: ["hho"] },
    { char: "っま", keys: ["mma"] },
    { char: "っみ", keys: ["mmi"] },
    { char: "っむ", keys: ["mmu"] },
    { char: "っめ", keys: ["mme"] },
    { char: "っも", keys: ["mmo"] },
    { char: "っや", keys: ["yya"] },
    { char: "っゆ", keys: ["yyu"] },
    { char: "っよ", keys: ["yyo"] },
    { char: "っら", keys: ["rra"] },
    { char: "っり", keys: ["rri"] },
    { char: "っる", keys: ["rru"] },
    { char: "っれ", keys: ["rre"] },
    { char: "っろ", keys: ["rro"] },
    { char: "っわ", keys: ["wwa"] },
    { char: "っを", keys: ["wwo"] },

    // 一文字コード
    { char: "あ", keys: ["a"] },
    { char: "い", keys: ["i", "yi"] },
    { char: "う", keys: ["u", "whu", "wu"] },
    { char: "え", keys: ["e"] },
    { char: "お", keys: ["o"] },
    { char: "か", keys: ["ka", "ca"] },
    { char: "き", keys: ["ki"] },
    { char: "く", keys: ["ku", "cu", "qu"] },
    { char: "け", keys: ["ke"] },
    { char: "こ", keys: ["ko"] },
    { char: "さ", keys: ["sa"] },
    { char: "し", keys: ["si", "shi", "ci"] },
    { char: "す", keys: ["su"] },
    { char: "せ", keys: ["se"] },
    { char: "そ", keys: ["so"] },
    { char: "た", keys: ["ta"] },
    { char: "ち", keys: ["chi", "ti"] },
    { char: "つ", keys: ["tu", "tsu"] },
    { char: "て", keys: ["te"] },
    { char: "と", keys: ["to"] },
    { char: "な", keys: ["na"] },
    { char: "に", keys: ["ni"] },
    { char: "ぬ", keys: ["nu"] },
    { char: "ね", keys: ["ne"] },
    { char: "の", keys: ["no"] },
    { char: "は", keys: ["ha"] },
    { char: "ひ", keys: ["hi"] },
    { char: "ふ", keys: ["fu", "hu"] },
    { char: "へ", keys: ["he"] },
    { char: "ほ", keys: ["ho"] },
    { char: "ま", keys: ["ma"] },
    { char: "み", keys: ["mi"] },
    { char: "む", keys: ["mu"] },
    { char: "め", keys: ["me"] },
    { char: "も", keys: ["mo"] },
    { char: "や", keys: ["ya"] },
    { char: "ゆ", keys: ["yu"] },
    { char: "よ", keys: ["yo"] },
    { char: "ら", keys: ["ra"] },
    { char: "り", keys: ["ri"] },
    { char: "る", keys: ["ru"] },
    { char: "れ", keys: ["re"] },
    { char: "ろ", keys: ["ro"] },
    { char: "わ", keys: ["wa"] },
    { char: "を", keys: ["wo"] },
    { char: "ぁ", keys: ["la", "xa"] },
    { char: "ぃ", keys: ["li", "xi"] },
    { char: "ぅ", keys: ["lu", "xu"] },
    { char: "ぇ", keys: ["le", "xe"] },
    { char: "ぉ", keys: ["lo", "xo"] },
    { char: "ゃ", keys: ["lya", "xya"] },
    { char: "ゅ", keys: ["lyu", "xyu"] },
    { char: "ょ", keys: ["lyo", "xyo"] },
    { char: "ヵ", keys: ["lka", "xka"] },
    { char: "ヶ", keys: ["lke", "xke"] },
    { char: "っ", keys: ["ltu", "ltsu", "xtu", "xtsu"] },
    { char: "ゎ", keys: ["lwa", "xwa"] },
    { char: "が", keys: ["ga"] },
    { char: "ぎ", keys: ["gi"] },
    { char: "ぐ", keys: ["gu"] },
    { char: "げ", keys: ["ge"] },
    { char: "ご", keys: ["go"] },
    { char: "ざ", keys: ["za"] },
    { char: "じ", keys: ["ji", "zi"] },
    { char: "ず", keys: ["zu"] },
    { char: "ぜ", keys: ["ze"] },
    { char: "ぞ", keys: ["zo"] },
    { char: "だ", keys: ["da"] },
    { char: "ぢ", keys: ["di"] },
    { char: "づ", keys: ["du"] },
    { char: "で", keys: ["de"] },
    { char: "ど", keys: ["do"] },
    { char: "ば", keys: ["ba"] },
    { char: "び", keys: ["bi"] },
    { char: "ぶ", keys: ["bu"] },
    { char: "べ", keys: ["be"] },
    { char: "ぼ", keys: ["bo"] },
    { char: "ぱ", keys: ["pa"] },
    { char: "ぴ", keys: ["pi"] },
    { char: "ぷ", keys: ["pu"] },
    { char: "ぺ", keys: ["pe"] },
    { char: "ぽ", keys: ["po"] },
    { char: "ヴ", keys: ["vu"] },
    { char: "a", keys: ["a"] },
    { char: "b", keys: ["b"] },
    { char: "c", keys: ["c"] },
    { char: "d", keys: ["d"] },
    { char: "e", keys: ["e"] },
    { char: "f", keys: ["f"] },
    { char: "g", keys: ["g"] },
    { char: "h", keys: ["h"] },
    { char: "i", keys: ["i"] },
    { char: "j", keys: ["j"] },
    { char: "k", keys: ["k"] },
    { char: "l", keys: ["l"] },
    { char: "m", keys: ["m"] },
    { char: "n", keys: ["n"] },
    { char: "o", keys: ["o"] },
    { char: "p", keys: ["p"] },
    { char: "q", keys: ["q"] },
    { char: "r", keys: ["r"] },
    { char: "s", keys: ["s"] },
    { char: "t", keys: ["t"] },
    { char: "u", keys: ["u"] },
    { char: "v", keys: ["v"] },
    { char: "w", keys: ["w"] },
    { char: "x", keys: ["x"] },
    { char: "y", keys: ["y"] },
    { char: "z", keys: ["z"] },
    { char: "A", keys: ["a"] },
    { char: "B", keys: ["b"] },
    { char: "C", keys: ["c"] },
    { char: "D", keys: ["d"] },
    { char: "E", keys: ["e"] },
    { char: "F", keys: ["f"] },
    { char: "G", keys: ["g"] },
    { char: "H", keys: ["h"] },
    { char: "I", keys: ["i"] },
    { char: "J", keys: ["j"] },
    { char: "K", keys: ["k"] },
    { char: "L", keys: ["l"] },
    { char: "M", keys: ["m"] },
    { char: "N", keys: ["n"] },
    { char: "O", keys: ["o"] },
    { char: "P", keys: ["p"] },
    { char: "Q", keys: ["q"] },
    { char: "R", keys: ["r"] },
    { char: "S", keys: ["s"] },
    { char: "T", keys: ["t"] },
    { char: "U", keys: ["u"] },
    { char: "V", keys: ["v"] },
    { char: "W", keys: ["w"] },
    { char: "X", keys: ["x"] },
    { char: "Y", keys: ["y"] },
    { char: "Z", keys: ["z"] },
    { char: "0", keys: ["0"] },
    { char: "1", keys: ["1"] },
    { char: "2", keys: ["2"] },
    { char: "3", keys: ["3"] },
    { char: "4", keys: ["4"] },
    { char: "5", keys: ["5"] },
    { char: "6", keys: ["6"] },
    { char: "7", keys: ["7"] },
    { char: "8", keys: ["8"] },
    { char: "9", keys: ["9"] },
    { char: "ー", keys: ["-"] },
    { char: "～", keys: ["-"] },
    { char: "、", keys: [","] },
    { char: "。", keys: ["."] },
    { char: "#", keys: ["#"] },
    { char: ";", keys: [";"] },
    { char: ":", keys: [":"] },
    { char: "(", keys: ["("] },
    { char: ")", keys: [")"] },
    { char: "\"", keys: ["\""] },
    { char: "\\", keys: ["\\"] },
    { char: "\n", keys: ["\n"] },
    { char: "\t", keys: ["\t"] },
    { char: "\r", keys: ["\r"] },
    { char: "<", keys: ["<"] }, { char: ">", keys: [">"] },
    { char: ",", keys: [","] },
    { char: ".", keys: ["."] },
    { char: "{", keys: ["{"] },
    { char: "}", keys: ["}"] },
    { char: "[", keys: ["["] },
    { char: "]", keys: ["]"] },
    { char: " ", keys: [" "] },
    { char: "=", keys: ["="] },
    { char: "%", keys: ["%"] },
    { char: "+", keys: ["+"] },
    { char: "-", keys: ["-"] },
    { char: "*", keys: ["*"] },
    { char: "/", keys: ["/"] },
    { char: "_", keys: ["_"] },
    { char: "^", keys: ["^"] },
    { char: "~", keys: ["~"] },
    { char: "!", keys: ["!"] },
    { char: "&", keys: ["&"] },
    { char: "'", keys: ["'"] },
    { char: "|", keys: ["|"] },
    { char: "@", keys: ["@"] },
    { char: "`", keys: ["`"] },
    { char: "?", keys: ["?"] },
  ],
}

const show_messages: Ref<components['schemas']['task']> = ref([]);
const all_messages = [{ "content": "かわいそうだね^^\n", "yomi": "かわいそうだね", "iconUri": "https://q.trap.jp/api/v3/public/icon/Kasyu", "authorDisplayName": "火楸", "grade": "23B", "authorName": "Kasyu", "updatedAt": "2024/06/13 18:15", "citated": "俺は全強", "image": "", "stamps": [{ "stampId": "6308a443-69f0-45e5-866f-56cc2c93578f", "count": 16 }] }, { "content": "リーダーですが、traOの勧誘が怖いです", "yomi": "りだですがtraOのかんゆうがこわいです", "iconUri": "https://q.trap.jp/api/v3/public/icon/kenken", "authorDisplayName": "けんけん", "grade": "23B", "authorName": "kenken", "updatedAt": "2024/06/12 19:04", "citated": "", "image": "", "stamps": [{ "stampId": "6308a443-69f0-45e5-866f-56cc2c93578f", "count": 15 }, { "stampId": "8f74bc52-e2ec-4b15-a02b-c269488a3b1c", "count": 1 }, { "stampId": "a40b7e73-40c4-4bc7-93fd-1a9bfc04e7cd", "count": 1 }] }, { "content": "最悪の文章すぎる", "yomi": "さいあくのぶんしょうすぎる", "iconUri": "https://q.trap.jp/api/v3/public/icon/YHz_ikiri", "authorDisplayName": "YHz / イキリ虻", "grade": "22B", "authorName": "YHz_ikiri", "updatedAt": "2024/06/11 14:02", "citated": "", "image": "", "stamps": [{ "stampId": "e1c9f12d-139e-496d-a593-663e9046a0a2", "count": 1 }, { "stampId": "f75c69fb-001e-4a36-b815-11c10f08c0ef", "count": 1 }, { "stampId": "6308a443-69f0-45e5-866f-56cc2c93578f", "count": 16 }, { "stampId": "deb05b43-ff10-46b6-b20c-8d0bd3b1afce", "count": 1 }] }, { "content": "や、ケモノだったわ", "yomi": "やけものだったわ", "iconUri": "https://q.trap.jp/api/v3/public/icon/NapoliN", "authorDisplayName": "八重樫 夏鈴", "grade": "23M", "authorName": "NapoliN", "updatedAt": "2024/06/12 00:25", "citated": "", "image": "", "stamps": [{ "stampId": "6308a443-69f0-45e5-866f-56cc2c93578f", "count": 16 }, { "stampId": "c31f75a4-8e1e-46c8-8472-143d78561dd9", "count": 1 }] }, { "content": "19B/23M 不仲学年で有名\n", "yomi": "19B23Mふなかがくねんでゆうめい", "iconUri": "https://q.trap.jp/api/v3/public/icon/toki", "authorDisplayName": "とき 🦊", "grade": "23M", "authorName": "toki", "updatedAt": "2024/06/15 17:42", "citated": "20B/24M 和気藹々仲良し学年で有名\n", "image": "https://q.trap.jp/files/06fb3270-6f05-4b40-89b3-c30db8d4dcf6", "stamps": [{ "stampId": "6308a443-69f0-45e5-866f-56cc2c93578f", "count": 18 }, { "stampId": "75b7f20d-4d6e-4074-b328-b324a750d91f", "count": 1 }] }]


let i = 0;
show_messages.value.push(all_messages[0]);
keygraph.build(all_messages[i].yomi);
const disp = () => {
  console.log("key candidate", keygraph.key_candidate())
  console.log("key done", keygraph.key_done())
  console.log("seq candidate", keygraph.seq_candidates())
  console.log("seq done", keygraph.seq_done())
}
const typing_state = ref({
  seq_candidate: keygraph.seq_candidates(),
  seq_done: keygraph.seq_done(),
  key_candidate: keygraph.key_candidate(),
  key_done: keygraph.key_done()
})
const misstype = ref(0);

// keydownのイベント処理
document.addEventListener("keydown", (e: KeyboardEvent) => {
  if (keygraph.next(e.key)) {
    typing_state.value = {
      seq_candidate: keygraph.seq_candidates(),
      seq_done: keygraph.seq_done(),
      key_candidate: keygraph.key_candidate(),
      key_done: keygraph.key_done()
    }
  } else {
    score.value -= 10;
    misstype.value++;
  }
  if (keygraph.is_finished()) {
    // すべての文字をタイプし終わったとき
    i++;
    show_messages.value.push(all_messages[i]);
    if (i == all_messages.length) {
      console.log("`syuuryou")
      console.log("to Result")
    }
    keygraph.build(all_messages[i].yomi);
    typing_state.value = {
      seq_candidate: keygraph.seq_candidates(),
      seq_done: keygraph.seq_done(),
      key_candidate: keygraph.key_candidate(),
      key_done: keygraph.key_done()
    }
  }
  disp();
});
disp();
</script>

<template>
  <div class="countdown">
    <h1 class="fadein countdown_one">1</h1>
    <h1 class="fadein countdown_two">2</h1>
    <h1 class="fadein countdown_three">3</h1>
    <h1 class="fadein countdown_start">スタート！</h1>
  </div>
  <div class="HomeWrapper">
    <div class="HomeContainer">
      <div class="SidebarContainer">
        <Sidebar :level="this.$route.query.level" :isNSFW=false :score=score />
      </div>
      <div class="MainContainer">
        <div class="body">
          <div class="container">
            <div class="layoutContainer">
              <div class="taskContainer">
                <Task :tasks="show_messages" />
                <div class="typing_container">
                  <p>
                    <span class="done">{{ typing_state.seq_done }}</span>
                    <span class="candidate">{{ typing_state.seq_candidate }}</span>
                  </p>
                  <p>
                    <span class="done">{{ typing_state.key_done }}</span>
                    <span class="candidate">{{ typing_state.key_candidate }}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.HomeWrapper {
  height: 100vh;
  width: 100vw;
}

.HomeContainer {
  height: 100%;
  display: flex;
}

.SidebarContainer {
  background: var(--theme-background-tertiary-default);
  height: 100%;
  max-width: 400px;
  min-width: 260px;
  flex-shrink: 0;
  flex-basis: calc(260px +(100vw - 700px)* .0752688172);
}

.MainContainer {
  opacity: 1;
  position: relative;
  width: 100%;
  min-width: 0;
  transition: opacity .3s ease;
  contain: strict;
  overflow-y: scroll;
}

.body {
  width: 100%;
}

.container {
  width: 100%;
  /* height: 100vh; */
  display: flex;
  flex-direction: column;
}

.layoutContainer {
  position: relative;
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.taskContainer {
  color: var(--theme-ui-primary-default);
  display: flex;
  flex-direction: row;
  position: relative;
  height: 100vh;
  background: var(--specific-main-view-background);
  flex: 1 1;
  flex-direction: column;
  position: relative;
  width: 100%;
}

.candidate {
  font-size: 1.6rem;
  color: black;
}

.done {
  font-size: 1.6rem;
  color: red;
}

.typing {
  margin-top: 64px;
}

.fadein {
  position: absolute;
  top: 45%;
  left: 35%;
  transform: translate(-50%, -50%);
  margin: 0 auto;
  width: 500px;
  opacity: 0;
  overflow: hidden;
  font-family: "Mochiy Pop One", sans-serif;
  animation-name: fadein;
  animation-duration: 1.5s;
  animation-timing-function: ease-out;
  animation-fill-mode: forwards;
  z-index: 2;
  color: black;
}

.countdown {
  width: 100%;
}

.countdown_start {
  animation-delay: 6.5s;
  animation-duration: 1s;
}

.countdown_one {
  animation-delay: 5s;
}

.countdown_two {
  animation-delay: 3.5s;
}

.countdown_three {
  animation-delay: 2s;
}

@keyframes fadein {
  0% {
    opacity: 0;
    transform: scale(100);
  }

  50% {
    opacity: 1;
    transform: scale(1);
  }

  75% {
    opacity: 1;
    transform: scale(1);
  }

  100% {
    opacity: 0;
    transform: scale(0);
  }
}
</style>