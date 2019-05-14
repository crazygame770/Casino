import Level from '../Level'
import CompilerConfig from '../../world/ai/compile/CompilerConfig'

export default class Level3 extends Level {
  constructor(id) {
    super(id, {
      nameTemplate: "level3_name",
      objectiveTemplate: "level3_objective",
      startingCode: "if e == switch:\n\tstep(e)\nendif\n",
      startingEditorType: "graph",
      maxStep: 100,
      speedTarget: 2,
      lengthTarget: 3
    })

    Object.freeze(this)
  }

  buildCompilerConfig() {
    return new CompilerConfig({
      excludePrimary: ['assign', 'jump', 'anchor'],
      variables: 0,
      terrainTypes: ['hole'],
      objectTypes: ['switch'],
      valueFunctions: [],
      actionFunctions: ['step_once'],
      leftComparisonExpressions: ['direction'],
      rightComparisonExpressions: ['object_type', 'terrain_type']
    })
  }

  buildRuleset(world) {
    return super.buildRuleset(world)
  }
}