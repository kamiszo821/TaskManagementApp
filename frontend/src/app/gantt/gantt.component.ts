import { Component, ViewChild } from '@angular/core';
import { GanttDataService } from '../_services/GanttDataService';
import { EditSettingsModel, ToolbarItem, GanttComponent as SyncfusionGanttComponent, PdfExportProperties, CriticalPathService } from '@syncfusion/ej2-angular-gantt';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';
import { ActivatedRoute } from '@angular/router';
import { TeamService } from '../_services/team.service';

interface Resource {
  resourceId: number;
  resourceName: string;
}

@Component({
  selector: 'app-gantt',
  templateUrl: './gantt.component.html',
  styleUrls: ['./gantt.component.scss']
})
export class GanttComponent {

  public data: any[] = [];
  public taskSettings?: object;
  public editSettings?: EditSettingsModel;
  public toolbar?: ToolbarItem[];
  public resources?: Resource[];
  resourceFields: { id: string; name: string; unit: string; }| any;
  public labelSettings?: object;

  currentTeamId: number = 0;

  @ViewChild('gantt', { static: true })
  public ganttChart?: SyncfusionGanttComponent;
  teamId: number = 2;
  constructor(private ganttService: GanttDataService, private route: ActivatedRoute, private teamService: TeamService) { }

  public ngOnInit(): void {
    this.route.params.subscribe(params => {
      const teamId = +params['teamId'];
      this.loadTasks(teamId);
      this.loadResources(teamId);
    });


    this.taskSettings = {
      id: 'TaskID',
      name: 'TaskName',
      startDate: 'StartDate',
      endDate: 'EndDate',
      duration: 'Duration',
      progress: 'Progress',
      dependency: 'Predecessor',
      child: 'subtasks',
      notes: 'info',
      resourceInfo: 'Resources',
    };

    this.resourceFields= {
      id: 'resourceId',
      name: 'resourceName',
      unit: 'Unit'
  };

    this.editSettings = {
      allowAdding: true,
      allowEditing: true,
      allowDeleting: true,
      allowTaskbarEditing: true,
      showDeleteConfirmDialog: true,
    };


    this.labelSettings = {
      taskLabel: 'Resources'
  };

    this.toolbar = ['Add', 'Edit', 'Update', 'Delete',
      'Cancel','PdfExport', 'CriticalPath', 'PrevTimeSpan', 'NextTimeSpan'];
  }

  loadTasks(teamId: number): void {
    this.currentTeamId = teamId;
    this.ganttService.getTasksByTeamId(teamId).subscribe(tasks => {
      console.log('Raw server response:', tasks);
      this.data = tasks.map(task => {
        return JSON.parse(task.data);
      });
      console.log('Processed tasks:', this.data);
    }, error => {
      console.error('Error fetching tasks for team:', teamId, error);
    });
  }

  private loadResources(teamId: number): void {
    this.teamService.getTeamResources(teamId).subscribe(resources => {
      this.resources = resources.map(res => {
        const resourceId = res.id.split('-')[1];
        return {
          resourceId: parseInt(resourceId, 10),
          resourceName: res.name
        };
      });
      console.log(this.resources);
    });
  }


  public toolbarClick(args: ClickEventArgs): void {
    console.log('Toolbar click event:', args);

    if (args.item.id === 'ganttDefault_pdfexport') {
      console.log('PDF Export button clicked');

      if (this.ganttChart) {
        console.log('Gantt chart reference is defined, calling pdfExport()');
        let exportProperties: PdfExportProperties = {
          exportType: 'CurrentViewData',
          pageOrientation: 'Landscape',
          pageSize: 'A4',
          theme: 'Material'
        };

        this.ganttChart.pdfExport(exportProperties);
      } else {
        console.error('Gantt chart reference is undefined.');
      }
    }
  }

  handleActionComplete(args: any): void {
    this.logAction(args);
    if (args.action === 'TaskbarEditing' || args.action === 'DrawConnectorLine' || args.action === 'CellEditing'  || args.action === 'DialogEditing') {
      console.log("Dane" + this.data);

      const taskData = this.transformTaskForDatabase(args.data);
      console.log("Dane po transformacji" + this.data);
      console.log(taskData);
      console.log("taksidekk" + taskData.TaskID)

      this.ganttService.updateTask(taskData.TaskID, this.currentTeamId, taskData).subscribe(
        (response) => {
          console.log("Dane po updacie" + this.data);
          console.log('Taskbar editing saved:', response);
          this.loadTasks(this.currentTeamId);
          console.log("Current idekkk" + this.currentTeamId)
        },
        (error) => {
          console.error('Error updating task:', error);
        }
      );
    }


    if (args.action === 'add') {
      console.log("Action type is add.");

      const newTask = args.data;
      const transformedTask = this.transformTaskForDatabase(newTask);
      const taskId = transformedTask.TaskID;
      console.log('Task ID: ' + taskId);
      const teamId = this.currentTeamId;
      console.log('Id taska ' + taskId)
      console.log('Id teamu ' + teamId)
      console.log('Tranformed task ' + transformedTask)
      this.ganttService.createTask(transformedTask, taskId, teamId).subscribe(() => {
        console.log('AfterTransform' + JSON.stringify(transformedTask));
        this.loadTasks(teamId);
      });
    }

    if (args.action === 'delete') {
      console.log("Delete action args:", args.data[0].TaskID);

      const taskIdToDelete = args.data[0].TaskID;
      const teamId = this.currentTeamId;

      if (taskIdToDelete && teamId) {
        this.ganttService.deleteTask(taskIdToDelete, teamId).subscribe(
          () => {
            console.log('Task deleted successfully, Task ID:', taskIdToDelete);
            this.loadTasks(this.currentTeamId);
          },
          (error) => {
            console.error('Error deleting task:', error);
          }
        );
      } else {
        console.error('Task ID or Team ID is undefined or invalid.');
      }
    }
  }

  transformTaskForDatabase(task: any): any {
    const resourceIds = this.mapResourceNamesToIds(task.Resources);
    return {
      TaskID: Number(task.TaskID),
      Progress: task.Progress,
      SubTasks: [],
      TaskName: task.TaskName,
      StartDate: task.StartDate,
      EndDate: task.EndDate,
      Duration: task.Duration,
      Predecessor: task.Predecessor,
      Notes: task.Notes,
      Resources: resourceIds
    };
  }

  mapResourceNamesToIds(resourceNames: string): number[] {
    if (!resourceNames) return [];
    const namesArray = resourceNames.split(',');
    return namesArray.map(name => {
      const resource = this.resources.find(r => r.resourceName === name.trim());
      return resource ? resource.resourceId : null;
    }).filter(id => id !== null);
  }

  logAction(args: any): void {
    if (args && args.action) {
      console.log('Action:', args.action);
    }
  }
}
