import { Component, OnInit } from '@angular/core';
import { TeamService } from '../_services/team.service';
import { TeamDTO } from '../_services/team.service';
import { TreeNode } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-team-members',
  templateUrl: './team-members.component.html',
  styleUrls: ['./team-members.component.scss']
})
export class TeamMembersComponent implements OnInit {
  teamsWithUsers!: TeamDTO[];
  teamsTree!: TreeNode[];

  constructor(private teamService: TeamService, private router: Router) { }

  ngOnInit(): void {
    this.loadTeamHierarchy();
  }

  loadTeamHierarchy(): void {
    this.teamService.getTeamHierarchy().subscribe((tree) => {
      this.teamsTree = tree;
    });
  }

  navigateToGanttChart(teamId: number): void {
    const routePath = `/GanttChart/${teamId}`;
    console.log("Navigating to:", routePath);

    this.router.navigate([routePath]);
  }

  navigateToKanbanTable(teamId: number): void {
    const routePath = `/kanbanTable/${teamId}`;
    this.router.navigate([routePath]);
  }

}
