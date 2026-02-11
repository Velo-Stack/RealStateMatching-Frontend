import { Buildings } from "phosphor-react";
import { getLabelByValue, TEAM_TYPES } from "../../../constants/enums";
import { TEAM_TYPE_COLORS } from "../constants/teamsConstants";

const TeamDetailsPanel = ({ team }) => (
  <div className={`bg-gradient-to-r ${TEAM_TYPE_COLORS[team.type] || TEAM_TYPE_COLORS.LANDS} p-4`}>
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center">
          <Buildings size={20} className="text-white" />
        </div>
        <div>
          <h3 className="text-white font-bold">{team.name}</h3>
          <p className="text-white/70 text-xs">{getLabelByValue(TEAM_TYPES, team.type)}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-lg">
          {team.members?.length || 0} أعضاء
        </span>
      </div>
    </div>
  </div>
);

export default TeamDetailsPanel;
